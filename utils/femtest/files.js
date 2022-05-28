import { isBrowser, isNode } from "./envUtils.js";

/**
 * Get the list of test files to load.
 * Select the appropriate method for running in browser or Node
 * @param {string} configPath path to config file
 * @returns {Array} filenames
 */
const { getFilenames } = await (async function envLoadFile() {
    if (isBrowser()) {
        return await import('./browserFiles.js');
    } else if (isNode()) {
        return await import('./nodeFiles.js');
    } else {
        throw new Error("Only running in a web browser and Node are currently implemented.");
    }
})();

/**
 * Dynamically import modules from filenames, for side effects only
 * @param {Array} filenames 
 */
async function loadModulesFromFilenames(filenames) {
    const modulePromises = filenames.map(function loadModule(file) {
        return import(file);
    });
    await Promise.all(modulePromises);
    return modulePromises;
}

/**
 * Load modules whose filenames are listed at `configPath`
 * @param {string} configPath path to config file
 */
export async function gatherFiles(configPath) {
    const filenames = await getFilenames(configPath);
    await loadModulesFromFilenames(filenames);
    return filenames;
}
