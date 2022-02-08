/**
 * @param {string} selector DOM selector
 * @param {object} doc object like `document`
 * @returns {Array} filenames
 */
function getFilenames(selector, doc = document) {
    return Array.from(doc.querySelector(selector).children).map(function filenameFromLi(elLi) {
        return elLi.textContent;
    });
}

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
 * Load modules whose filenames are listed at `selector`
 * @param {string} selector DOM selector
 */
export async function gatherFiles(selector) {
    return await loadModulesFromFilenames(getFilenames(selector));
}
