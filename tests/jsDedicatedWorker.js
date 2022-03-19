/// https://stackoverflow.com/questions/44118600/web-workers-how-to-import-modules
/// Doesn't work for Firefox as of 2022-03-15
/// https://bugzilla.mozilla.org/show_bug.cgi?id=1247687
import * as ExampleApp from "../www/exampleApp.js";

self.addEventListener("message", function TestWorker_onmessage(event) {
    const workerMessage = `worker message : ${event.data}, ${ExampleApp.MAX_THINGS}, ${ExampleApp.add(2, 3)}`;
    setTimeout(function postLater() {
        postMessage(workerMessage);
    }, 1000);
});
