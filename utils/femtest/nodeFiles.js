import * as FsPromises from "fs/promises";
import * as Path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

/**
 * @param {string} configPath path to config file
 * @returns {Array} filenames
 */
export async function getFilenames(configPath) {
    const filePath = Path.resolve(__dirname, configPath);
    const response = await FsPromises.readFile(filePath);
    const config = JSON.parse(response);
    return config.testFiles;
}
