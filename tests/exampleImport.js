import { Test, assert } from "../utils/femtest/test.js";
import * as ExampleApp from "../www/exampleApp.js";

Test.itShould("return 5 as ExampleApp.sum(2, 3)", function testFive() {
    const val1 = 2, val2 = 3, expected = 5, result = ExampleApp.add(val1, val2);
    assert.strictEqual(result, expected);
});
