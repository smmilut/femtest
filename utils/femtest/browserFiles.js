/**
 * @param {string} configPath path to config file
 * @returns {Array} filenames
 */
export async function getFilenames(configPath) {
    const response = await fetch(configPath);
    const config = await response.json();
    return config.testFiles;
}
