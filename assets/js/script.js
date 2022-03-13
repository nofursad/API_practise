const API_KEY = "xTmi9S4qIx2yLR9GpQ_16DiKizs";
const API_URL = "https://ci-jshint.herokuapp.com/api"
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));


function processOptions(form) {
    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") {
            optArray.push(e[1]);
        }
    }

    form.delete("options");

    form.append("options", optArray.join());

    return form;
}


async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                                 body: form,
                        });
    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }
    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
}

async function getStatus(e){
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data  = await response.json();

    if (response.ok) {
        displayStatus(data.expiry);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").innerHTML = `<h2>API Key Status</h2>`;
    document.getElementById("results-content").innerHTML = `<p>Your key is valid unitl <br>${data}</p>`;
    resultsModal.show();
}

function displayException(data) {

    let heading = `An Exception Occured`;
    let result = `<div>The API returned Status code ${data.status_code}</div>`;
    result += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    result += `<div>Error Text: <strong>${data.error}</strong></div>`

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = result;
    
    resultsModal.show();
}