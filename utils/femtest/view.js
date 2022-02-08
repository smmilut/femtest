export function view(results, selector, doc = document) {
    const elParent = doc.querySelector(selector);
    Array.from(results.groups.entries()).map(
        function resultGroupToHtml([groupName, resultArray]) {
            const elGroup = doc.createElement("section");
            const elGroupHeader = doc.createElement("header");
            elGroupHeader.textContent = `Tests for ${groupName} :`;
            elGroup.appendChild(elGroupHeader);
            resultArray.map(
                function resultToHtml(result) {
                    const elResult = doc.createElement("article");
                    const elResultDescription = doc.createElement("p");
                    if (result.isPass) {
                        elResultDescription.textContent = `\u2705 OK it should "${result.description}".`;
                    } else {
                        elResultDescription.innerHTML = `\u274C FAIL it doesn't "${result.description}" because : <code>${result.error}</code>`;
                    }
                    elResult.appendChild(elResultDescription);

                    elGroup.appendChild(elResult);
                }
            );
            elParent.appendChild(elGroup);
        }
    );
    const elSummary = doc.createElement("summary");
    elSummary.textContent = `=> RESULT : ${results.summary.totalLength} total = ${results.summary.countFail} FAIL + ${results.summary.countOk} OK`;
    elParent.appendChild(elSummary);
}