import { Test, assert } from "../utils/femtest/test.js";
import * as MyApp from "../www/myapp.js";

Test.itShould("return 5 as MyApp.sum(2, 3)", function testFive() {
    const val1 = 2, val2 = 3, expected = 5, result = MyApp.add(val1, val2);
    assert.strictEqual(result, expected);
});
