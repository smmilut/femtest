import { isBrowser, isNode } from "./envUtils.js";

export const { view, viewFileList } = await (async function envGetView() {
    if (isBrowser()) {
        return await import('./browserView.js');
    } else if (isNode()) {
        return await import('./nodeView.js');
    } else {
        throw new Error("Only running in a web browser and Node are currently implemented.");
    }
})();
