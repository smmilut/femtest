# femtest

## Description

femto-test ultra simple testing framework

## Status

basic usable

## How to write

Import "test.js" and use `Test.itShould()` to add a test :

js```
import { Test, assert } from "../utils/femtest/test.js";

Test.itShould("do something / description here", function testSomething() {
    /// prepare test here
    const val1 = 2, val2 = 3, expected = 5, result = val1 + val2;
    /// assert at the end
    assert.strictEqual(expected, result);
});
```

### How to choose which tests are run

Reference your test files' paths in `index.html` as a new `<li> tag inside tag `<ul id="filelist">`. You can use absolute paths or relative to the `index.html`.

html```
<ul id="filelist">
    <li>/tests/femtestEquals.js</li>
    <li>/tests/femtestThrows.js</li>
    <li>../../tests/femtestImport.js</li>
</ul>
```

### Note on async tests

Asynchronous code can be tested, but some care must be taken, see example :

js```
itShould("eventually handle the correct value", async function later() {
    let value = "initial";
    setTimeout(function after1s() {
        value = "after 1s";
    }, 1000);
    /*
        If your tested functions use async behaviour like "setTimeout",
         then you should wrap the "assert" parts in Promises.
    */
    return new Promise(function runLater(resolve, reject) {
        value = "when starting Promise executor";
        /// Starting long operation for 2s
        setTimeout(function after2s() {
            /// Testing behaviour after 2s
            try {
                /*
                    All assert and all possible exceptions thrown from your tests
                     should be wrapped in try ... catch, then be rejected.
                */
                assert.strictEqual(value, "after 1s");
                resolve();
            } catch (e) {
                reject(e);
            }
        }, 2000);

        value = "when returning from Promise executor";
    });
});
```

## How to run

Run the web server in the root directory and browse to [the index.html](http://0.0.0.0:8000/utils/femtest/index.html)
