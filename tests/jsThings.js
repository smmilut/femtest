import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("JS things")

itShould("Object.assign replaces target", function objectAssign() {
    const o1 = {
        a: "a1",
        b: "b1",
    };
    const o2 = {
        b: "b2",
        c: "c2",
    };
    const result = Object.assign(o1, o2);
    const expected = {
        a: "a1",
        b: "b2",
        c: "c2"
    };
    assert.objectsShallowStrictEqual(result, expected);
    assert.objectsShallowStrictEqual(o1, expected);
});

itShould("running Background API completes correctly", function background() {
    /* --- noise for predictable rand --- */
    const MAX_INT32 = ~(1 << 31);
    function squirrelNoise5(index, seed = 0) {
        const SQ5_BIT_NOISE1 = 0xd2a80a3f;  // 11010010101010000000101000111111
        const SQ5_BIT_NOISE2 = 0xa884f197;  // 10101000100001001111000110010111
        const SQ5_BIT_NOISE3 = 0x6C736F4B;  // 01101100011100110110111101001011
        const SQ5_BIT_NOISE4 = 0xB79F3ABB;  // 10110111100111110011101010111011
        const SQ5_BIT_NOISE5 = 0x1b56c4f5;  // 00011011010101101100010011110101

        let mangledBits = index;  // could explicitly convert here
        mangledBits *= SQ5_BIT_NOISE1;
        mangledBits += seed;
        mangledBits ^= (mangledBits >> 9);
        mangledBits += SQ5_BIT_NOISE2;
        mangledBits ^= (mangledBits >> 11);
        mangledBits *= SQ5_BIT_NOISE3;
        mangledBits ^= (mangledBits >> 13);
        mangledBits += SQ5_BIT_NOISE4;
        mangledBits ^= (mangledBits >> 15);
        mangledBits *= SQ5_BIT_NOISE5;
        mangledBits ^= (mangledBits >> 17);
        return mangledBits;
    }
    function get1dNoiseZeroToOne(index, seed = 0) {
        return squirrelNoise5(index, seed) * 1.0 / MAX_INT32;
    }
    const rand = {
        init(seed = 0, initIndex = 0) {
            this.seed = seed;
            this.initIndex = initIndex;
            this.reset();
        },
        reset() {
            this.index = this.initIndex;
        },
        next() {
            return get1dNoiseZeroToOne(this.index++, this.seed);
        },
    };
    rand.init();

    /* --- init --- */
    function fastInitArray(size) {
        return Array(size).fill(0).map(() => rand.next());
    }

    /* --- the slow part --- */
    function slowSample(xs) {
        /**
         * Slow when size = 10000 then 1.5s
         */
        return function sampleSize(size) {
            function updatedArray(oldArray, newValue) {
                return [...oldArray, newValue]
            }
            let array = [];
            while (array.length < size) {
                array = updatedArray(array, xs[Math.floor(rand.next() * xs.length)]);
            }
            return array;
        };
    }

    /* --- chunk utilities --- */
    function splitNumber(size) {
        return function splitN(n) {
            // console.log("splitting", Math.min(size, n), "leaving", Math.max(n - size, 0));
            return {
                nextWorkInput: Math.min(size, n),
                workRemaining: Math.max(n - size, 0),
            };
        };
    }
    function aggregateResultChunks({ previousWorkDone, latestWork }) {
        return [...previousWorkDone, ...latestWork];
    }
    function isCompleted({ latestWork, workDone, workRemaining }) {
        // console.log("is completed", workRemaining === undefined || workRemaining <= 0, latestWork, workDone, workRemaining);
        return workRemaining === undefined || workRemaining <= 0;
    }

    /* --- go --- */
    const workSize = 100000;

    return runBackground({
        doWork: slowSample(fastInitArray(10000)),
        splitWork: splitNumber(1000),
        aggregateWork: aggregateResultChunks,
        initialWork: [],
        isWorkCompleted: isCompleted,
    })(workSize).then(function done(result) {
        console.log("done with", result);
        assert.strictEqual(result.workRemaining, 0);
        assert.strictEqual(result.workDone.length, workSize);
        assert.almostEqual(result.workDone[0], 0.3470445025465658, { error: 0.0000001 });

    });
});

function runBackground({
    doWork,
    splitWork,
    aggregateWork,
    initialWork,
    isWorkCompleted,
    timeout,
}) {
    return function runBackgroundWithInput(workInput) {
        return new Promise(function promiseBackgroundResult(resolve, reject) {
            (function requestNewIdleWork({
                workRemaining,
                workDone,
                accumulatedDuration,
                startDate,
            }) {
                requestIdleCallback(function runIdleCallback(deadline) {
                    if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
                        try {
                            let newWorkRemaining = workRemaining;
                            let newWorkDone = workDone;
                            let newAccumulatedDuration = accumulatedDuration;
                            while (deadline.timeRemaining() > 0 || deadline.didTimeout) {
                                // console.log("continue work this time");
                                // console.log(deadline.timeRemaining(), "ms left at beginning");
                                const splitted = splitWork(workRemaining);
                                const nextWorkInput = splitted.nextWorkInput;
                                newWorkRemaining = splitted.workRemaining;
                                const chunkStartDate = new Date();
                                const latestWork = doWork(nextWorkInput);
                                newAccumulatedDuration = accumulatedDuration + (new Date() - chunkStartDate);
                                newWorkDone = aggregateWork({ previousWorkDone: workDone, latestWork });
                                // console.log(workDone, latestWork, newWorkDone);
                                if (isWorkCompleted({ latestWork, workDone: newWorkDone, workRemaining: newWorkRemaining })) {
                                    resolve({
                                        workDone: newWorkDone,
                                        workRemaining: newWorkRemaining,
                                        accumulatedDuration: newAccumulatedDuration,
                                        fullDuration: (new Date()) - startDate,
                                    });
                                    return;
                                }
                                // console.log(deadline.timeRemaining(), "ms left at end");

                                workRemaining = newWorkRemaining;
                                workDone = newWorkDone;
                                accumulatedDuration = newAccumulatedDuration;
                            }
                            // console.log("continue work next time");
                            requestNewIdleWork({
                                workRemaining: newWorkRemaining,
                                workDone: newWorkDone,
                                accumulatedDuration: newAccumulatedDuration,
                                startDate,
                            });
                            return;
                        } catch (e) {
                            reject(e);
                            return;
                        }
                    } else {
                        console.log("no time remaining");
                        requestNewIdleWork({
                            workRemaining,
                            workDone,
                            accumulatedDuration,
                            startDate,
                        });
                        return;
                    }
                },
                    { timeout }
                );
            })({
                workRemaining: workInput,
                workDone: initialWork,
                accumulatedDuration: 0,
                startDate: new Date(),
            });

        });
    };
}