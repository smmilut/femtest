# femtest

## Description

femto-test ultra simple testing framework

## Status

rewriting as html page

## How to write

Import "test.js" and use `Test.it()` to add a test :

js```
import { Test, assert } from "../utils/femtest/test.js";

Test.it("do something / description here", function testSomething() {
    /// prepare test here
    const val1 = 2, val2 = 3, expected = 5, result = val1 + val2;
    /// assert at the end
    assert.strictEqual(expected, result);
});
```

Reference your test files' paths in `index.html` as a new `<li> tag inside tag `<ul id="filelist">`. You can use absolute paths or relative to the `index.html`.

html```
<ul id="filelist">
    <li>/tests/femtestEquals.js</li>
    <li>/tests/femtestThrows.js</li>
    <li>../../tests/femtestImport.js</li>
</ul>
```

## How to run

Run the web server in the root directory and browse to (http://0.0.0.0:8000/utils/femtest/index.html)
