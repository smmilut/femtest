# femtest

## Description

femto-test ultra simple testing framework

## Status

rewriting as html page

## How to write

js```
import { Test, assert } from "../utils/femtest/test.js";

Test.it("do something / description here", function testSomething() {
    /// prepare test here
    const val1 = 2, val2 = 3, expected = 5, result = val1 + val2;
    /// assert at the end
    assert.strictEqual(expected, result);
});
```

Reference your test files' paths (relative or absolute) in `index.html` 's `<main>` tag, separated by new lines :

html```
<main>
    ../../tests/femtestImport.js
    /tests/femtestEquals.js
</main>
```

## How to run

Run the web server in the root directory and browse to (http://0.0.0.0:8000/utils/femtest/index.html)
