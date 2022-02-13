import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("async / later");

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
            assert.strictEqual(value, "after 1s", { resolve, reject });
        }, 2000);
        value = "when returning from Promise executor";
    });
});

itShould("test 0.5s", async function later500ms() {
    let value = "initial";
    return new Promise(function runLater(resolve, reject) {
        setTimeout(function after500ms() {
            assert.strictEqual(value, "when returning from Promise executor", { resolve, reject });
        }, 500);
        value = "when returning from Promise executor";
    });
});

itShould("test 1s", async function later1s() {
    let value = "initial";
    return new Promise(function runLater(resolve, reject) {
        setTimeout(function after1s() {
            assert.strictEqual(value, "when returning from Promise executor", { resolve, reject });
        }, 1000);
        value = "when returning from Promise executor";
    });
});

itShould("test 1.5s", async function later1500ms() {
    let value = "initial";
    return new Promise(function runLater(resolve, reject) {
        setTimeout(function after1500ms() {
            assert.strictEqual(value, "when returning from Promise executor", { resolve, reject });
        }, 1500);
        value = "when returning from Promise executor";
    });
});