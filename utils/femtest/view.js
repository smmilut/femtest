/**
 * view test results in the document
 * @param {object} results test results
 * @param {string} selector DOM selector of parent element
 * @param {object} doc the `document`
 */
export function view(results, selector, doc = document) {
    const elParent = doc.querySelector(selector);
    /// Append all result groups
    const elGroups = resultGroupsToHtml(results.groups, doc)
    elGroups.forEach(function appendGroupToParent(elGroup) {
        elParent.appendChild(elGroup);
    });
    /// Append global test summary
    const elSummary = globalSummaryToHTml(results.summary, doc);
    elParent.appendChild(elSummary);
}

/**
 * Generate HTML for all the groups
 * @param {Map} groups Map([
                    [groupName1, { description, index, isPass, error, returned }],
                    [groupName2, result2],
                    ...])
 * @param {object} doc the `document`
 * @returns {Array} [ groupHtml ]
 */
function resultGroupsToHtml(groups, doc = document) {
    return Array.from(groups.entries()).map(
        function resultGroupEntryToHtml([groupName, resultArray]) {
            return resultGroupToHtml(groupName, resultArray, doc);
        }
    );
}

/**
 * Generate HTML for the whole test group, and return it
 * @param {string} groupName 
 * @param {Array} resultArray [ results ]
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the results of the test group
 */
function resultGroupToHtml(groupName, resultArray, doc = document) {
    /// Create section and header
    const elGroup = resultGroupToSectionHtml(groupName, doc);
    /// Append results
    resultArray.map(
        function appendResultToGroup(result) {
            const elResult = resultToHtml(result, doc);
            elGroup.appendChild(elResult);
        }
    );
    return elGroup;
}

/**
 * Generate the HTML section and header for beginning the test group, and return it
 * @param {string} groupName 
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the section of results of the test group
 */
function resultGroupToSectionHtml(groupName, doc = document) {
    /// Create Section
    const elGroup = doc.createElement("section");
    /// Append header
    const elGroupHeader = doc.createElement("header");
    elGroupHeader.textContent = `Tests for ${groupName} :`;
    elGroup.appendChild(elGroupHeader);
    return elGroup;
}

/**
 * Generate the HTML for this test result, and return it
 * @param {object} result { description, index, isPass, error, returned }
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the test result
 */
function resultToHtml(result, doc = document) {
    /// Create result
    const elResult = doc.createElement("article");
    /// Append result content
    const elResultPass = doc.createElement("span");
    const elResultDescription = doc.createElement("span");
    const elResultInfo = doc.createElement("p");
    if (result.isPass) {
        elResultPass.textContent = `\u2714 OK`;
        elResultDescription.textContent = `it should "${result.description}".`;
        if (result.returned !== undefined) {
            elResultInfo.textContent = `Returned : ${result.returned}`;
        }
    } else {
        elResultPass.textContent = `\u2718 FAIL`;
        elResultDescription.textContent = `it doesn't "${result.description}"`;
        if (result.error !== undefined) {
            const elError = doc.createElement("p");
            elError.innerHTML = `<code>${result.error}</code>`;
            elResultInfo.appendChild(elError);
            if (result.error.stack !== undefined) {
                const elStack = doc.createElement("pre");
                elStack.textContent = `${result.error.stack}`;
                elResultInfo.appendChild(elStack);
            }
        }
    }
    elResult.appendChild(elResultPass);
    elResult.appendChild(elResultDescription);
    elResult.appendChild(elResultInfo);

    return elResult;
}

/**
 * @param {object} summary { totalLength, totalRun, countOk, countFail }
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the summary of test results
 */
function globalSummaryToHTml(summary, doc = document) {
    const elSummary = doc.createElement("summary");
    elSummary.textContent = `=> RESULT : ${summary.totalLength} total = ${summary.countFail} FAIL + ${summary.countOk} OK`;
    return elSummary;
}