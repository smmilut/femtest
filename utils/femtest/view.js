/**
 * view test results in the document
 * @param {object} results test results
 * @param {string} selector DOM selector of parent element
 * @param {object} doc the `document`
 */
export function view(results, selector, doc = document) {
    const elParent = doc.querySelector(selector);
    /// Append global test summary
    const elSummary = globalSummaryToHTml(results.summary, doc);
    elParent.appendChild(elSummary);
    /// Append all result groups
    const elGroups = resultGroupsToHtml(results.groups, doc)
    elGroups.forEach(function appendGroupToParent(elGroup) {
        elParent.appendChild(elGroup);
    });
}

/**
 * Generate HTML for all the groups
 * @param {Map} groups Map([
                    [groupName1, [{ description, index, isPass, error, returned }, result1b, result1c, ...]],
                    [groupName2, [result2a, ...]],
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
    elGroup.classList.add("box");
    /// Append header
    const elGroupHeader = doc.createElement("h3");
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
    const elResultPassFailIcon = doc.createElement("span");    
    elResultPassFailIcon.classList.add("passfailIcon");
    const elResultPassFail = doc.createElement("span");
    elResultPassFail.classList.add("passfail");
    const elResultDescription = doc.createElement("span");
    const elResultInfo = doc.createElement("p");
    if (result.isPass) {
        elResultPassFailIcon.textContent = "\u2714";
        elResultPassFailIcon.classList.add("passIcon");
        elResultPassFail.textContent = "OK";
        elResultPassFail.classList.add("pass");
        elResultDescription.textContent = `it should "${result.description}".`;
        if (result.returned !== undefined) {
            elResultInfo.textContent = `Returned : ${result.returned}`;
        }
    } else {
        elResultPassFailIcon.textContent = "\u2718";
        elResultPassFailIcon.classList.add("failIcon");
        elResultPassFail.textContent = "FAIL";
        elResultPassFail.classList.add("fail");
        elResultDescription.textContent = `it doesn't "${result.description}"`;
        if (result.error !== undefined) {
            const elError = doc.createElement("p");
            elError.classList.add("errorMsg");
            elError.innerHTML = `<code>${result.error}</code>`;
            elResultInfo.appendChild(elError);
            if (result.error.stack !== undefined) {
                const elStack = doc.createElement("pre");
                elStack.classList.add("stackTrace");
                elStack.textContent = `${result.error.stack}`;
                elResultInfo.appendChild(elStack);
            }
        }
    }
    elResult.appendChild(elResultPassFailIcon);
    elResult.appendChild(elResultPassFail);
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
    /// Create summary section
    const elSummary = doc.createElement("summary");
    elSummary.classList.add("box");
    /// Append title
    const elSummaryTitle = doc.createElement("h3");
    elSummaryTitle.textContent = "Summary :";
    elSummary.appendChild(elSummaryTitle);
    /// Append summary result
    const elPassOrFail = doc.createElement("p");
    const elPassFailIcon = doc.createElement("span");    
    elPassFailIcon.classList.add("passfailIcon");
    const elPassFailText = doc.createElement("span");    
    elPassFailText.classList.add("passfail");
    if (summary.countFail === 0) {
        elPassFailIcon.textContent = "\u2714";
        elPassFailIcon.classList.add("passIcon");
        elPassFailText.textContent = "SUCCESS";
        elPassFailText.classList.add("pass");
    } else {
        elPassFailIcon.textContent = "\u2718";
        elPassFailIcon.classList.add("failIcon");
        elPassFailText.textContent = "FAILED";
        elPassFailText.classList.add("fail");
    }
    elPassOrFail.appendChild(elPassFailIcon);
    elPassOrFail.appendChild(elPassFailText);
    elSummary.appendChild(elPassOrFail);
    /// Append summary details line
    const elSummaryDetails = doc.createElement("p");
    elSummaryDetails.textContent = `${summary.totalRun}/${summary.totalLength} ran = ${summary.countFail} FAIL + ${summary.countOk} OK`;
    elSummary.appendChild(elSummaryDetails);    
    return elSummary;
}