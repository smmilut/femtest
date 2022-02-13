/**
 * @param {Function} f 
 * @returns {bool} is `f` async
 */
export function isAsync(f) {
    return f.constructor.name === "AsyncFunction";
}
