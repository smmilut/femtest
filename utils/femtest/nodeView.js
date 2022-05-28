/** @module view version that runs in Node */

/** display individual result */
function showResult(result) {
    const passString = result.isPass ? "OK" : "FAIL";
    const verb = result.isPass ? "it should" : "it doesn't";
    console.log(`[${passString}] ${result.groupName} : ${verb} "${result.description}".`);
    if (result.returned !== undefined) {
        console.log(`Returned : ${result.returned}`);
    }
    if (result.error !== undefined) {
        console.log(result.error);
        if (result.error.stack !== undefined) {
            console.log(result.error.stack);
        }
    }
}

/** calculate summary/pass/fail */
function getSummaryPassFailProgress(summary) {
    if (summary.totalRun < summary.totalLength) {
        /// progress
        const progressPct = (100 * summary.totalRun / summary.totalLength).toFixed(1);
        return `IN PROGRESS ${progressPct}%`;
    } else if (summary.countFail === 0) {
        /// pass
        return "SUCCESS";
    } else {
        /// fail
        return "FAILED";
    }
}

/** display summary */
function updateGlobalSummary(summary) {
    const passFailProgress = getSummaryPassFailProgress(summary);
    console.log(`\t(${passFailProgress}) ${summary.totalRun} / ${summary.totalLength} ran = ${summary.countFail} FAIL + ${summary.countOk} OK`);
}

export function view(results) {
    results.promises.forEach(function promiseView(resultPromise) {
        resultPromise.then(
            function viewResult(result) {
                showResult(result);
                updateGlobalSummary(results.summary);
            }
        );
    });
}

export function viewFileList(filenames) {
    console.log("file list", filenames);
}