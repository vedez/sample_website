// helper function to process and display data
function processData(data) {
    const tbody = document.getElementById('table');  // access to table 

    data.forEach(entry => {
        const [firstName, lastName] = entry.name.split(' '); // split name into first and last 
        const row = `<tr>
                        <td>${firstName}</td>
                        <td>${lastName}</td>
                        <td>${entry.id}</td>
                    </tr>`;
        tbody.innerHTML += row;  // add the processed data as a new row in the table
    });
}

// 1. Synchronous XMLHttpRequest (Note: Browser waits for each req to complete before moving on)
function fetchDataSync() {
    let xml_req = new XMLHttpRequest();  
    // fetch reference.json
    xml_req.open('GET', 'data/reference.json', false);  // synchronous request to reference.json
    xml_req.send();

    let reference = JSON.parse(xml_req.responseText);  // parse the response
    // fetch data1.json using the reference file
    xml_req.open('GET', `data/${reference.data_location}`, false);  // synchronous request to data1.json
    xml_req.send();

    let data1 = JSON.parse(xml_req.responseText);
    processData(data1.data);  // display data

    // fetch data2.json using data1.json
    xml_req.open('GET', `data/${data1.data_location}`, false);  // synchronous request to data2.json
    xml_req.send();

    let data2 = JSON.parse(xml_req.responseText);
    processData(data2.data);  // display data

    // fetch data3.json directly
    xml_req.open('GET', 'data/data3.json', false);  // synchronous request to data3.json
    xml_req.send();

    let data3 = JSON.parse(xml_req.responseText);
    processData(data3.data);  // display data
}

// 2. Asynchronous XMLHttpRequest with Callbacks (Note: Browser does not wait for req to complete. First request finishes, it calls another request using callback func.)
function fetchDataAsync() {
    let xml_req = new XMLHttpRequest();

    xml_req.onreadystatechange = function () {
        // check state and status of request
        if (xml_req.readyState === 4 && xml_req.status === 200) {
            let reference = JSON.parse(xml_req.responseText);  // parse reference.json
            let xml_req1 = new XMLHttpRequest();

            xml_req1.onreadystatechange = function () {
                // check state and status of request
                if (xml_req1.readyState === 4 && xml_req1.status === 200) {
                    let data1 = JSON.parse(xml_req1.responseText);
                    processData(data1.data);  // display data

                    let xml_req2 = new XMLHttpRequest();

                    xml_req2.onreadystatechange = function () {
                        // check state and status of request
                        if (xml_req2.readyState === 4 && xml_req2.status === 200) {
                            let data2 = JSON.parse(xml_req2.responseText);
                            processData(data2.data);  // display data

                            let xml_req3 = new XMLHttpRequest();

                            xml_req3.onreadystatechange = function () {
                                // check state and status of request
                                if (xml_req3.readyState === 4 && xml_req3.status === 200) {
                                    let data3 = JSON.parse(xml_req3.responseText);
                                    processData(data3.data);  // display data
                                }
                            };
                            xml_req3.open('GET', 'data/data3.json', true);  // asynchronous request for data3.json
                            xml_req3.send();
                        }
                    };
                    xml_req2.open('GET', `data/${data1.data_location}`, true);  // asynchronous request for data2.json
                    xml_req2.send();
                }
            };
            xml_req1.open('GET', `data/${reference.data_location}`, true);  // asynchronous request for data1.json
            xml_req1.send();
        }
    };

    xml_req.open('GET', 'data/reference.json', true);  // asynchronous request for reference.json
    xml_req.send();
}

// 3. Fetch API with Promises (note: uses .then() blocks to fetch data in sequences and process it - processes data async)
function fetchDataWithFetch() {
    fetch('data/reference.json')  // fetch reference.json
        .then(response => response.json())  
        .then(reference => {
            return fetch(`data/${reference.data_location}`);  // fetch data1.json using reference.json
        })

        .then(response => response.json())
        .then(data1 => {
            processData(data1.data);  // display data
            return fetch(`data/${data1.data_location}`);  // fetch data2.json using data1.json
        })
        .then(response => response.json())
        .then(data2 => {
            processData(data2.data);  // display data
            return fetch('data/data3.json');  // fetch data3.json
        })
        .then(response => response.json())
        .then(data3 => {
            processData(data3.data);  // display data
        })
        .catch(error => console.error('Error fetching data:', error));  // error handling
}

// web buttons functionality
document.getElementById('sync').addEventListener('click', fetchDataSync);
document.getElementById('async').addEventListener('click', fetchDataAsync);
document.getElementById('fetch').addEventListener('click', fetchDataWithFetch);
