/**
 * @param {string} s 
 * @returns {Array} split, trim, remove empty strings
 */
 function cleanSplit(s) {
    return s.split("\n").map(s => s.trim()).filter(s => s !== "");
}

/**
 * @param {string} selector DOM selector
 * @returns text blob of file list
 */
function getFileListInput(selector) {
    return document.querySelector(selector).textContent;
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
}

/**
 * Load modules whose filenames are listed at `selector`
 * @param {string} selector DOM selector
 */
export async function gatherFiles(selector) {
    const filelist = getFileListInput(selector);    
    const filenames = cleanSplit(filelist);
    await loadModulesFromFilenames(filenames);
}
