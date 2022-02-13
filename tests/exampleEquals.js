import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("femtestEquals")

itShould("return 5 as sum(2, 3)", function testFive() {
    const val1 = 2, val2 = 3, expected = 5, result = val1 + val2;
    assert.strictEqual(result, expected);
});
