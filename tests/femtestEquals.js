import { group, assert } from "../utils/femtest/test.js";
const it = group("femtestEquals")

it("return 5 as sum(2, 3)", function testFive() {
    const val1 = 2, val2 = 3, result = 5;
    assert.strictEqual(val1 + val2, result);
});
