/**
 * Environment utilities
 * @module envUtils
 */

export const getGlobalObject = new Function("return this;");

export function isBrowser() {
    return typeof window !== "undefined" && window === getGlobalObject();
}

export function isNode() {
    return typeof global !== "undefined" && global === getGlobalObject();
}
