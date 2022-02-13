/**
 * view test results in the document
 * @param {object} results test results
 * @param {string} selector DOM selector of parent element
 * @param {object} doc the `document`
 */
export function view(results, selector, doc = document) {
    const elParent = doc.querySelector(selector);
    /// Append global test summary
    const elSummary = updateGlobalSummary(results.summary, doc);
    elParent.appendChild(elSummary);
    /// Promise to view each result
    results.promises.forEach(function promiseView(resultPromise) {
        resultPromise.then(
            function viewResult(result) {
                createResultGroup(result.groupName, elParent, doc);
                addResultToGroup(result, doc);
                updateGlobalSummary(results.summary, doc);
            }
        );
    });
}

/**
 * Create or update the result group
 * @param {string} groupName 
 * @param {Node} elParent parent Element where the group's Element will be appended if it is newly created
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the result group
 */
function createResultGroup(groupName, elParent, doc = document) {
    const idGroup = groupNameToId(groupName);
    let elGroup = doc.getElementById(idGroup);
    if (!elGroup) {
        /// Create Section
        const elGroup = doc.createElement("section");
        elGroup.setAttribute("id", idGroup);
        elGroup.classList.add("box");
        /// Append header
        const elGroupHeader = doc.createElement("h3");
        elGroupHeader.textContent = `Tests for ${groupName} :`;
        elGroup.appendChild(elGroupHeader);
        elParent.appendChild(elGroup);
    }
    return elGroup;
}

/**
 * Sanitize and standardize the HTML id for test groups
 * @param {string} groupName 
 * @returns {string} ID usable for HTML
 */
function groupNameToId(groupName) {
    return `femtestGroup-${groupName.replace(/[^a-zA-Z0-9]+/g, "_")}`;
}

/**
 * Generate the result HTML and append it to the group's Node
 * @param {object} result { description, index, groupName, isCompleted, isPass, error, returned }
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the test result
 */
function addResultToGroup(result, doc = document) {
    const idGroup = groupNameToId(result.groupName);
    const elGroup = doc.getElementById(idGroup);
    const elResult = resultToHtml(result, doc = document)
    elGroup.appendChild(elResult);
    return elResult;
}

/**
 * Generate the HTML for this test result, and return it
 * @param {object} result { description, index, groupName, isCompleted, isPass, error, returned }
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
 * Create or update the global summary
 * @param {object} summary { totalLength, totalRun, countOk, countFail }
 * @param {object} doc the `document`
 * @returns {Node} HTML element for the summary of test results
 */
function updateGlobalSummary(summary, doc = document) {
    const idSummary = "femtestGlobalSummary";
    let elSummary = doc.getElementById(idSummary);
    if (!elSummary) {
        /// Create summary section
        elSummary = doc.createElement("summary");
        elSummary.setAttribute("id", idSummary);
        elSummary.classList.add("box");
    }
    elSummary.innerHTML = "";
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
    if (summary.totalRun < summary.totalLength) {
        elPassFailIcon.textContent = "\u231B";
        elPassFailIcon.classList.add("progressIcon");
        elPassFailText.textContent = `IN PROGRESS ${100 * summary.totalRun / summary.totalLength}%`;
        elPassFailText.classList.add("progress");
    } else if (summary.countFail === 0) {
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