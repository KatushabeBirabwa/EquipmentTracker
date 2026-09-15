// ==========================================
// NAVIGATION BUTTONS
// ==========================================

const dashboardBtn = document.getElementById("dashboardBtn");
const inventoryBtn = document.getElementById("inventoryBtn");
const assignBtn = document.getElementById("assignBtn");
const returnBtn = document.getElementById("returnBtn");
const searchBtn = document.getElementById("searchBtn");
const signatureBtn = document.getElementById("signatureBtn");


// ==========================================
// PAGE SECTIONS
// ==========================================

const dashboardSection =
    document.getElementById("dashboardSection");

const inventorySection =
    document.getElementById("inventorySection");

const assignForm =
    document.getElementById("assignForm");

const returnForm =
    document.getElementById("returnForm");

const searchSection =
    document.getElementById("searchSection");

const signatureSection =
    document.getElementById("signatureSection");


// ==========================================
// HIDE ALL SECTIONS
// ==========================================

function hideAllSections() {

    dashboardSection.style.display = "none";

    inventorySection.style.display = "none";

    assignForm.style.display = "none";

    returnForm.style.display = "none";

    searchSection.style.display = "none";

    signatureSection.style.display = "none";
}


// ==========================================
// DASHBOARD BUTTON
// ==========================================

dashboardBtn.addEventListener("click", function () {

    hideAllSections();

    dashboardSection.style.display = "block";
});


// ==========================================
// INVENTORY BUTTON
// ==========================================

inventoryBtn.addEventListener("click", function () {

    hideAllSections();

    inventorySection.style.display = "block";
});


// ==========================================
// ASSIGN EQUIPMENT BUTTON
// ==========================================

assignBtn.addEventListener("click", function () {

    hideAllSections();

    assignForm.style.display = "block";
});


// ==========================================
// RETURN EQUIPMENT BUTTON
// ==========================================

returnBtn.addEventListener("click", function () {

    hideAllSections();

    returnForm.style.display = "block";
});


// ==========================================
// SEARCH RECORDS BUTTON
// ==========================================

searchBtn.addEventListener("click", function () {

    hideAllSections();

    searchSection.style.display = "block";
});


// ==========================================
// SIGNATURE BUTTON
// ==========================================

signatureBtn.addEventListener("click", function () {

    hideAllSections();

    signatureSection.style.display = "block";
});


// ==========================================
// EQUIPMENT LIFECYCLE POLICY
// ==========================================

const lifecycleYears = {

    desktop: 5,

    monitor: 5,

    iphone: 5,

    ipad: 5,

    other: 5
};


// ==========================================
// LOAD DEVICES FROM API
// ==========================================

async function loadDevices() {

    try {

        const response = await fetch(
            "http://localhost:5050/api/devices"
        );

        if (!response.ok) {
            throw new Error("Unable to load devices");
        }

        const devices = await response.json();

        console.log(devices);


        // ----------------------------------
        // DASHBOARD COUNTS
        // ----------------------------------

        document.getElementById(
            "totalCount"
        ).textContent = devices.length;


        document.getElementById(
            "orderedCount"
        ).textContent =
            devices.filter(
                device =>
                    device.status === "Ordered"
            ).length;


        document.getElementById(
            "availableCount"
        ).textContent =
            devices.filter(
                device =>
                    device.status === "Available"
            ).length;


        document.getElementById(
            "assignedCount"
        ).textContent =
            devices.filter(
                device =>
                    device.status === "Assigned"
            ).length;


        document.getElementById(
            "returnedCount"
        ).textContent =
            devices.filter(
                device =>
                    device.status === "Returned"
            ).length;


        document.getElementById(
            "repairCount"
        ).textContent =
            devices.filter(
                device =>
                    device.status === "Repair"
            ).length;


        document.getElementById(
            "disposedCount"
        ).textContent =
            devices.filter(
                device =>
                    device.status === "Disposed"
            ).length;


        // ----------------------------------
        // INVENTORY LIST
        // ----------------------------------

        const inventoryResults =
            document.getElementById(
                "inventoryResults"
            );


        inventoryResults.innerHTML = "";


        devices.forEach(function (device) {

            inventoryResults.innerHTML += `

                <div class="inventory-card">

                    <p>
                        <strong>Asset Tag:</strong>
                        ${device.assetTag}
                    </p>

                    <p>
                        <strong>Equipment:</strong>
                        ${device.equipmentType}
                    </p>

                    <p>
                        <strong>Manufacturer:</strong>
                        ${device.manufacturer}
                    </p>

                    <p>
                        <strong>Model:</strong>
                        ${device.model}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${device.status}
                    </p>

                </div>
            `;
        });

    }
    catch (error) {

        console.error(
            "Unable to load equipment:",
            error
        );
    }
}


// ==========================================
// SEARCH RECORDS
// ==========================================

const findRecordBtn =
    document.getElementById("findRecordBtn");


const searchInput =
    document.getElementById("searchInput");


const searchResults =
    document.getElementById("searchResults");



findRecordBtn.addEventListener(
    "click",
    async function () {

        const searchValue =
            searchInput.value.trim();


        if (searchValue === "") {

            searchResults.innerHTML =
                "<p>Please enter an employee name, asset tag, or serial number.</p>";

            return;
        }


        try {

            const response = await fetch(

                `http://localhost:5050/api/devices/search?value=${encodeURIComponent(searchValue)}`

            );


            if (!response.ok) {

                throw new Error(
                    "Search failed"
                );
            }


            const records =
                await response.json();


            if (records.length === 0) {

                searchResults.innerHTML =
                    "<p>No matching records found.</p>";

                return;
            }


            searchResults.innerHTML = "";


            records.forEach(
                function (record) {

                    searchResults.innerHTML += `

                        <div class="search-card">

                            <h3>
                                ${record.employeeName
                                    ?? "No employee assigned"}
                            </h3>

                            <p>
                                <strong>Asset Tag:</strong>
                                ${record.assetTag}
                            </p>

                            <p>
                                <strong>Serial Number:</strong>
                                ${record.serialNumber}
                            </p>

                            <p>
                                <strong>Equipment:</strong>
                                ${record.equipmentType}
                            </p>

                            <p>
                                <strong>Model:</strong>
                                ${record.model}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                ${record.status}
                            </p>

                            <p>
                                <strong>Date Assigned:</strong>
                                ${record.dateAssigned
                                    ?? "N/A"}
                            </p>

                        </div>
                    `;
                }
            );

        }
        catch (error) {

            searchResults.innerHTML =
                "<p>Unable to connect to the API.</p>";

            console.error(error);
        }
    }
);


// ==========================================
// EQUIPMENT SIGNATURE
// ==========================================

const signBtn =
    document.getElementById("signBtn");


const signatureName =
    document.getElementById("signatureName");


const signatureMessage =
    document.getElementById(
        "signatureMessage"
    );



signBtn.addEventListener(
    "click",
    async function () {

        const name =
            signatureName.value.trim();


        // ----------------------------------
        // VALIDATE SIGNATURE
        // ----------------------------------

        if (name === "") {

            signatureMessage.textContent =
                "Please enter your full name.";

            return;
        }


        try {

            // ----------------------------------
            // SEND SIGNATURE TO C# API
            // ----------------------------------

            const response = await fetch(

                "http://localhost:5050/api/signatures/1/sign",

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        signatureID: 1,

                        assignmentID: 1003,

                        employeeName: name,

                        signatureData: name

                    })
                }
            );


            // ----------------------------------
            // CHECK API RESPONSE
            // ----------------------------------

            if (!response.ok) {

                throw new Error(
                    "Signature failed"
                );
            }


            const signedRecord =
                await response.json();


            console.log(
                "Signed record:",
                signedRecord
            );


            // ----------------------------------
            // SHOW SUCCESS
            // ----------------------------------

            signatureMessage.textContent =
                "Equipment form signed successfully.";


            signatureName.value = "";

        }
        catch (error) {

            signatureMessage.textContent =
                "Unable to sign the equipment form.";


            console.error(error);
        }
    }
);


// ==========================================
// LOAD DASHBOARD DATA WHEN PAGE OPENS
// ==========================================

loadDevices();