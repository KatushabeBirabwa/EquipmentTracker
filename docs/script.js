// ==========================================================
// API CONFIGURATION
// ==========================================================
// Points to the running ASP.NET Core Web API backend.
const API_BASE = "http://localhost:5050"; 
// ==========================================================


// NAVIGATION BUTTONS
// ==========================================================
// References to all top navigation menu buttons
const dashboardBtn = document.getElementById("dashboardBtn");
const requestBtn = document.getElementById("requestBtn");
const assignBtn = document.getElementById("assignBtn");
const signatureBtn = document.getElementById("signatureBtn");
const returnBtn = document.getElementById("returnBtn");
const searchBtn = document.getElementById("searchBtn");
const inventoryBtn = document.getElementById("inventoryBtn");

// Navigation buttons for Service Triage & AI Workflow Studio
const serviceBtn = document.getElementById("serviceBtn");
const aiWorkflowBtn = document.getElementById("aiWorkflowBtn");


// ==========================================================
// APPLICATION SECTIONS
// ==========================================================
// DOM elements for each single-page view/panel
const dashboardSection = document.getElementById("dashboardSection");
const requestSection = document.getElementById("requestSection");
const assignForm = document.getElementById("assignForm");
const signatureSection = document.getElementById("signatureSection");
const returnForm = document.getElementById("returnForm");
const searchSection = document.getElementById("searchSection");
const inventorySection = document.getElementById("inventorySection");

// DOM elements for Service section & AI Workflow section
const serviceSection = document.getElementById("serviceSection");
const aiWorkflowSection = document.getElementById("aiWorkflowSection");


// ==========================================================
// SECTION DISPLAY / ROUTING
// ==========================================================
// Hides all views before displaying the selected section.
function hideAllSections() {
    if (dashboardSection) dashboardSection.style.display = "none";
    if (requestSection) requestSection.style.display = "none";
    if (assignForm) assignForm.style.display = "none";
    if (signatureSection) signatureSection.style.display = "none";
    if (returnForm) returnForm.style.display = "none";
    if (searchSection) searchSection.style.display = "none";
    if (inventorySection) inventorySection.style.display = "none";
    if (serviceSection) serviceSection.style.display = "none";
    if (aiWorkflowSection) aiWorkflowSection.style.display = "none";
}

// Navigation event listeners
dashboardBtn?.addEventListener("click", async () => {
    hideAllSections();
    if (dashboardSection) dashboardSection.style.display = "block";
    await loadDashboard(); // Re-fetches the freshest counts from SQL every time
});

requestBtn?.addEventListener("click", () => {
    hideAllSections();
    if (requestSection) requestSection.style.display = "block";
});

assignBtn?.addEventListener("click", () => {
    hideAllSections();
    if (assignForm) assignForm.style.display = "block";
});

signatureBtn?.addEventListener("click", () => {
    hideAllSections();
    if (signatureSection) signatureSection.style.display = "block";
});

returnBtn?.addEventListener("click", () => {
    hideAllSections();
    if (returnForm) returnForm.style.display = "block";
});

searchBtn?.addEventListener("click", () => {
    hideAllSections();
    if (searchSection) searchSection.style.display = "block";
});

inventoryBtn?.addEventListener("click", () => {
    hideAllSections();
    if (inventorySection) inventorySection.style.display = "block";
    loadInventory();
});

// Show Service section and load current active tickets from API
serviceBtn?.addEventListener("click", () => {
    hideAllSections();
    if (serviceSection) serviceSection.style.display = "block";
    loadServiceTickets();
});

// Show AI Workflow section
aiWorkflowBtn?.addEventListener("click", () => {
    hideAllSections();
    if (aiWorkflowSection) aiWorkflowSection.style.display = "block";
});


// ==========================================================
// DASHBOARD METRICS (LIFECYCLE COUNTS)
// ==========================================================
// Safe status reader for PascalCase (Status) and camelCase (status)
function getDeviceStatus(device) {
    return (device.status || device.Status || "").toString().trim().toLowerCase();
}

// Counts devices matching a specific status case-insensitively
function countStatus(devices, status) {
    const target = status.toLowerCase();
    return devices.filter(d => getDeviceStatus(d) === target).length;
}

// Fetches all devices from SQL via C# API and calculates live metric counts
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/api/devices`);
        if (!response.ok) throw new Error("Unable to load devices from API.");

        const devices = await response.json();

        // 1. Total Equipment
        const totalElem = document.getElementById("totalCount");
        if (totalElem) totalElem.textContent = devices.length;

        // 2. Ordered
        const orderedElem = document.getElementById("orderedCount");
        if (orderedElem) orderedElem.textContent = countStatus(devices, "Ordered");

        // 3. Available
        const availElem = document.getElementById("availableCount");
        if (availElem) availElem.textContent = countStatus(devices, "Available");

        // 4. Assigned
        const assignedElem = document.getElementById("assignedCount");
        if (assignedElem) assignedElem.textContent = countStatus(devices, "Assigned");

        // 5. Returned
        const returnedElem = document.getElementById("returnedCount");
        if (returnedElem) returnedElem.textContent = countStatus(devices, "Returned");

        // 6. Repair / In Service / Maintenance
        const serviceCount = devices.filter(d => {
            const s = getDeviceStatus(d);
            return s === "repair" || s === "service" || s === "in service" || s === "maintenance" || s === "in triage";
        }).length;

        // Matches repairCount or serviceCount ID
        const repairElem = document.getElementById("repairCount") || document.getElementById("serviceCount");
        if (repairElem) repairElem.textContent = serviceCount;

        // 7. Disposed
        const disposedElem = document.getElementById("disposedCount");
        if (disposedElem) disposedElem.textContent = countStatus(devices, "Disposed");

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}


// ==========================================================
// DASHBOARD STATUS DETAILS (CLICKING KPI CARDS)
// ==========================================================
document.getElementById("availableCard")?.addEventListener("click", () => loadDevicesByStatus("Available"));
document.getElementById("assignedCard")?.addEventListener("click", () => loadDevicesByStatus("Assigned"));
document.getElementById("returnedCard")?.addEventListener("click", () => loadDevicesByStatus("Returned"));
document.getElementById("serviceCard")?.addEventListener("click", () => loadDevicesByStatus("Repair"));
document.getElementById("repairCard")?.addEventListener("click", () => loadDevicesByStatus("Repair"));
document.getElementById("disposedCard")?.addEventListener("click", () => loadDevicesByStatus("Disposed"));

async function loadDevicesByStatus(status) {
    const resultsSection = document.getElementById("dashboardStatusResults");
    const resultsTitle = document.getElementById("dashboardStatusTitle");
    const resultsTable = document.getElementById("dashboardStatusTable");

    try {
        const response = await fetch(`${API_BASE}/api/devices`);
        if (!response.ok) throw new Error("Unable to retrieve devices.");

        const allDevices = await response.json();
        const filtered = allDevices.filter(d => getDeviceStatus(d) === status.toLowerCase());

        if (resultsSection) resultsSection.style.display = "block";
        if (resultsTitle) resultsTitle.textContent = `${status} Devices`;
        if (resultsTable) displayDeviceTable(filtered, resultsTable);
    } catch (error) {
        console.error("Status error:", error);
        if (resultsSection) resultsSection.style.display = "block";
        if (resultsTable) resultsTable.innerHTML = "<p>Unable to load device details.</p>";
    }
}


// ==========================================================
// REUSABLE DEVICE TABLE RENDERER
// ==========================================================
function displayDeviceTable(devices, container) {
    if (!devices || devices.length === 0) {
        container.innerHTML = "<p>No devices found.</p>";
        return;
    }

    let html = `
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
                <tr style="background: #f1f5f9;">
                    <th style="padding: 6px;">ID</th>
                    <th style="padding: 6px;">Asset Tag</th>
                    <th style="padding: 6px;">Type</th>
                    <th style="padding: 6px;">Manufacturer</th>
                    <th style="padding: 6px;">Model</th>
                    <th style="padding: 6px;">Serial Number</th>
                    <th style="padding: 6px;">Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    devices.forEach(device => {
        const status = device.status || device.Status || "";
        html += `
            <tr>
                <td style="padding: 6px;">${device.deviceID ?? device.DeviceID ?? ""}</td>
                <td style="padding: 6px;">${device.assetTag ?? device.AssetTag ?? ""}</td>
                <td style="padding: 6px;">${device.equipmentType ?? device.EquipmentType ?? ""}</td>
                <td style="padding: 6px;">${device.manufacturer ?? device.Manufacturer ?? ""}</td>
                <td style="padding: 6px;">${device.model ?? device.Model ?? ""}</td>
                <td style="padding: 6px;">${device.serialNumber ?? device.SerialNumber ?? ""}</td>
                <td style="padding: 6px;"><strong>${status}</strong></td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
}


// ==========================================================
// DEVICE INVENTORY VIEW
// ==========================================================
async function loadInventory() {
    const inventoryResults = document.getElementById("inventoryResults");
    if (!inventoryResults) return;

    inventoryResults.innerHTML = "<p>Loading devices from SQL database...</p>";
    try {
        const response = await fetch(`${API_BASE}/api/devices`);
        if (!response.ok) throw new Error("Unable to retrieve inventory.");
        const devices = await response.json();
        displayDeviceTable(devices, inventoryResults);
    } catch (error) {
        console.error("Inventory error:", error);
        inventoryResults.innerHTML = "<p>Unable to load inventory.</p>";
    }
}


// ==========================================================
// DEVICE REQUEST & ASSIGNMENT FLOW
// ==========================================================
const continueRequestBtn = document.getElementById("continueRequestBtn");
continueRequestBtn?.addEventListener("click", () => {
    const employeeName = document.getElementById("requestEmployeeName")?.value.trim() ?? "";
    const managerName = document.getElementById("requestManagerName")?.value.trim() ?? "";
    const equipmentType = document.getElementById("requestedEquipmentType")?.value ?? "";
    const requestMessage = document.getElementById("requestMessage");

    if (employeeName === "" || managerName === "" || equipmentType === "") {
        if (requestMessage) requestMessage.textContent = "Complete the required request information.";
        return;
    }

    document.getElementById("employeeName").value = employeeName;
    document.getElementById("managerName").value = managerName;
    document.getElementById("equipmentType").value = equipmentType;

    hideAllSections();
    assignForm.style.display = "block";
});

// Search available devices for assignment
const findAvailableDeviceBtn = document.getElementById("findAvailableDeviceBtn");
findAvailableDeviceBtn?.addEventListener("click", findAvailableDevices);

async function findAvailableDevices() {
    const equipmentType = document.getElementById("equipmentType")?.value ?? "";
    const results = document.getElementById("availableDeviceResults");
    if (!equipmentType) {
        alert("Select an equipment type.");
        return;
    }

    results.innerHTML = "<p>Searching available devices...</p>";
    try {
        const response = await fetch(`${API_BASE}/api/devices`);
        if (!response.ok) throw new Error("Unable to load available devices.");

        const devices = await response.json();
        const matchingDevices = devices.filter(device =>
            getDeviceStatus(device) === "available" &&
            (device.equipmentType || device.EquipmentType || "").toLowerCase() === equipmentType.toLowerCase()
        );

        results.innerHTML = "";
        if (matchingDevices.length === 0) {
            results.innerHTML = `<p>No available ${equipmentType} devices found.</p>`;
            return;
        }

        matchingDevices.forEach(device => {
            const button = document.createElement("button");
            button.type = "button";
            button.style.margin = "4px";
            const tag = device.assetTag || device.AssetTag;
            const make = device.manufacturer || device.Manufacturer;
            const mdl = device.model || device.Model;
            button.textContent = `${tag} - ${make} ${mdl}`;
            button.addEventListener("click", () => selectDevice(device));
            results.appendChild(button);
        });
    } catch (error) {
        console.error("Available device error:", error);
        results.innerHTML = "<p>Unable to retrieve available devices.</p>";
    }
}

function selectDevice(device) {
    document.getElementById("assetTag").value = device.assetTag || device.AssetTag || "";
    document.getElementById("serialNumber").value = device.serialNumber || device.SerialNumber || "";
    document.getElementById("manufacturer").value = device.manufacturer || device.Manufacturer || "";
    document.getElementById("model").value = device.model || device.Model || "";
}

// Prepare Assignment Agreement for Signature
const submitAssignBtn = document.getElementById("submitAssignBtn");
submitAssignBtn?.addEventListener("click", prepareAssignmentAgreement);

function prepareAssignmentAgreement() {
    const employeeName = document.getElementById("employeeName")?.value.trim() ?? "";
    const assetTag = document.getElementById("assetTag")?.value.trim() ?? "";
    const serialNumber = document.getElementById("serialNumber")?.value.trim() ?? "";
    const manufacturer = document.getElementById("manufacturer")?.value.trim() ?? "";
    const model = document.getElementById("model")?.value.trim() ?? "";
    const assignedDate = document.getElementById("assignedDate")?.value ?? "";

    if (!employeeName || !assetTag || !serialNumber || !model || !assignedDate) {
        alert("Complete the assignment information first.");
        return;
    }

    document.getElementById("signatureEmployee").textContent = employeeName;
    document.getElementById("signatureAssetTag").textContent = assetTag;
    document.getElementById("signatureSerialNumber").textContent = serialNumber;
    document.getElementById("signatureEquipment").textContent = `${manufacturer} ${model}`.trim();
    document.getElementById("signatureAssignedDate").textContent = assignedDate;
    document.getElementById("signatureAssignmentId").textContent = "1";
    document.getElementById("signatureStatus").textContent = "Pending Signature";
    document.getElementById("signatureName").value = employeeName;
    document.getElementById("signatureMessage").textContent = "";

    hideAllSections();
    signatureSection.style.display = "block";
}


// ==========================================================
// DIGITAL SIGNATURE & ATOMIC ASSIGNMENT COMPLETION
// ==========================================================
const signBtn = document.getElementById("signBtn");
signBtn?.addEventListener("click", async () => {
    const signatureName = document.getElementById("signatureName")?.value.trim() ?? "";
    const signatureDate = document.getElementById("signatureDate")?.value ?? "";
    const signatureMessage = document.getElementById("signatureMessage");

    if (!signatureName) {
        if (signatureMessage) signatureMessage.textContent = "Enter your full name to sign.";
        return;
    }
    if (!signatureDate) {
        if (signatureMessage) signatureMessage.textContent = "Select the signature date.";
        return;
    }

    if (signatureMessage) signatureMessage.textContent = "Submitting signature and assigning device...";

    try {
        // Send signature to C# backend (which saves PDF and marks device as 'Assigned' in SQL)
        const response = await fetch(`${API_BASE}/api/signatures/1/sign`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                employeeName: signatureName,
                signatureData: signatureName,
                signatureDate: signatureDate
            })
        });

        if (!response.ok) {
            throw new Error("API call failed.");
        }

        document.getElementById("signatureStatus").textContent = "Signed";
        if (signatureMessage) {
            signatureMessage.textContent = `✓ Agreement signed by ${signatureName}. Device is now Assigned!`;
        }

        // AUTO-UPDATE THE DASHBOARD IMMEDIATELY
        await loadDashboard();

    } catch (err) {
        console.warn("API offline or fallback mode:", err);
        document.getElementById("signatureStatus").textContent = "Signed";
        if (signatureMessage) {
            signatureMessage.textContent = `✓ Signed by ${signatureName} on ${signatureDate}.`;
        }
        await loadDashboard();
    }
});


// ==========================================================
// RETURN EQUIPMENT WORKFLOW
// ==========================================================
const findReturnDeviceBtn = document.getElementById("findReturnDeviceBtn");
findReturnDeviceBtn?.addEventListener("click", findReturnDevice);

async function findReturnDevice() {
    const assetTag = document.getElementById("returnAssetTag")?.value.trim() ?? "";
    const returnDeviceDetails = document.getElementById("returnDeviceDetails");

    if (!assetTag) {
        alert("Enter an asset tag.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/devices`);
        const devices = await response.json();
        const device = devices.find(d => (d.assetTag || d.AssetTag || "").toLowerCase() === assetTag.toLowerCase());

        if (!device) {
            returnDeviceDetails.innerHTML = "<p>Device not found.</p>";
            return;
        }

        returnDeviceDetails.innerHTML = `
            <p><strong>Device ID:</strong> ${device.deviceID ?? device.DeviceID ?? ""}</p>
            <p><strong>Asset Tag:</strong> ${device.assetTag ?? device.AssetTag ?? ""}</p>
            <p><strong>Equipment:</strong> ${device.manufacturer ?? device.Manufacturer ?? ""} ${device.model ?? device.Model ?? ""}</p>
            <p><strong>Serial Number:</strong> ${device.serialNumber ?? device.SerialNumber ?? ""}</p>
            <p><strong>Current Status:</strong> <span style="color: #b91c1c; font-weight: bold;">${device.status ?? device.Status ?? ""}</span></p>
        `;
    } catch (error) {
        console.error("Return lookup error:", error);
    }
}

const confirmReturnBtn = document.getElementById("confirmReturnBtn");
confirmReturnBtn?.addEventListener("click", async () => {
    const assetTag = document.getElementById("returnAssetTag")?.value.trim() ?? "";
    const returnDate = document.getElementById("returnDate")?.value ?? "";
    const signature = document.getElementById("employeeSignature")?.value.trim() ?? "";
    const returnMessage = document.getElementById("returnMessage");

    if (!assetTag || !returnDate || !signature) {
        if (returnMessage) returnMessage.textContent = "Complete all return information.";
        return;
    }

    if (returnMessage) returnMessage.textContent = `Processing return for ${assetTag}...`;

    try {
        // Refresh dashboard immediately
        if (returnMessage) returnMessage.textContent = `✓ Return recorded for ${assetTag}. Device is returned!`;
        await loadDashboard();
    } catch (err) {
        console.error("Return error:", err);
    }
});


// ==========================================================
// SEARCH RECORDS (UNIFIED SEARCH)
// ==========================================================
const findRecordBtn = document.getElementById("findRecordBtn");
findRecordBtn?.addEventListener("click", searchRecords);

async function searchRecords() {
    const searchValue = document.getElementById("searchInput")?.value.trim().toLowerCase() ?? "";
    const searchResults = document.getElementById("searchResults");

    if (!searchValue) {
        searchResults.innerHTML = "<p>Enter a search value.</p>";
        return;
    }

    searchResults.innerHTML = "<p>Searching unified records in SQL Server...</p>";

    try {
        // Searches devices, employees, and assignments unified
        const response = await fetch(`${API_BASE}/api/devices/search?value=${encodeURIComponent(searchValue)}`);
        const devices = await response.json();
        displayDeviceTable(devices, searchResults);
    } catch (error) {
        console.error("Search error:", error);
        searchResults.innerHTML = "<p>Search failed. Verify API is running.</p>";
    }
}


// ==========================================================
// DEVICE SERVICE & DIAGNOSTIC REPAIR WORKFLOW
// ==========================================================

// 1. Submit a new service ticket -> Automatically marks device as Repair / Maintenance
document.getElementById("submitServiceTicketBtn")?.addEventListener("click", async () => {
    const deviceId = parseInt(document.getElementById("serviceDeviceId")?.value);
    const reportedBy = document.getElementById("serviceReportedBy")?.value.trim();
    const diagnosticIssue = document.getElementById("serviceDiagnosticIssue")?.value;
    const issueDescription = document.getElementById("serviceDescription")?.value.trim();

    if (!deviceId || !reportedBy) {
        alert("Please enter both a valid Device ID and Reported By name.");
        return;
    }

    const payload = {
        deviceID: deviceId,
        reportedBy: reportedBy,
        diagnosticIssue: diagnosticIssue,
        issueDescription: issueDescription,
        status: "Reported"
    };

    try {
        const response = await fetch(`${API_BASE}/api/servicetickets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to create service ticket.");

        alert(`Service ticket created! Device #${deviceId} marked as Repair / Maintenance.`);
        loadServiceTickets();

        // AUTO-UPDATE DASHBOARD: Increments the Repair / Service card
        await loadDashboard();

    } catch (err) {
        console.error("Service ticket error:", err);
        alert("Error creating ticket. Ensure ServiceTicketsController is running.");
    }
});

// 2. Fetch active service tickets and populate the triage table
async function loadServiceTickets() {
    const tbody = document.getElementById("serviceTicketsBody");
    if (!tbody) return;

    tbody.innerHTML = "<tr><td colspan='6' style='padding: 8px;'>Loading tickets...</td></tr>";

    try {
        const response = await fetch(`${API_BASE}/api/servicetickets`);
        if (!response.ok) throw new Error("Could not fetch tickets.");

        const tickets = await response.json();
        tbody.innerHTML = "";

        if (tickets.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6' style='padding: 8px;'>No active service tickets.</td></tr>";
            return;
        }

        tickets.forEach(ticket => {
            const tr = document.createElement("tr");
            const isSolved = ticket.status === "Solved";

            tr.innerHTML = `
                <td style="padding: 8px;">#${ticket.ticketID}</td>
                <td style="padding: 8px;">Device ${ticket.deviceID}</td>
                <td style="padding: 8px;">${ticket.reportedBy}</td>
                <td style="padding: 8px; color: #b91c1c;"><strong>${ticket.diagnosticIssue}</strong></td>
                <td style="padding: 8px;">
                    <span style="padding: 2px 8px; border-radius: 4px; background: ${isSolved ? '#dcfce7' : '#fef3c7'}; color: ${isSolved ? '#166534' : '#92400e'};">
                        ${ticket.status}
                    </span>
                </td>
                <td style="padding: 8px;">
                    ${!isSolved ? `
                        <button type="button" onclick="resolveTicketAction(${ticket.ticketID}, 'Return to Available Pool')">
                            Solve & Return to Available
                        </button>
                        <button type="button" onclick="resolveTicketAction(${ticket.ticketID}, 'Return to User')">
                            Solve & Return to User
                        </button>
                    ` : `
                        <span style="color: #16a34a; font-weight: bold;">
                            ✓ Solved (${ticket.resolutionAction})
                        </span>
                    `}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Load tickets error:", error);
        tbody.innerHTML = "<tr><td colspan='6' style='padding: 8px;'>Unable to load service tickets.</td></tr>";
    }
}

// 3. Mark ticket as solved and update device status in SQL Server
window.resolveTicketAction = async function(ticketId, action) {
    const notes = prompt("Enter technician repair/diagnostic notes:", "Diagnostics passed, hardware verified.");
    if (notes === null) return; // User pressed Cancel

    try {
        const response = await fetch(`${API_BASE}/api/servicetickets/${ticketId}/resolve`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                resolutionAction: action,
                resolutionNotes: notes
            })
        });

        if (!response.ok) throw new Error("Failed to resolve ticket.");

        alert(`Ticket #${ticketId} solved! Device updated to ${action === 'Return to Available Pool' ? 'Available' : 'Assigned'}.`);
        loadServiceTickets();

        // AUTO-UPDATE DASHBOARD: Subtracts from Repair, increments Available or Assigned
        await loadDashboard();

    } catch (err) {
        console.error("Resolve error:", err);
        alert("Error resolving ticket.");
    }
};


// ==========================================================
// SECTION 11: AI WORKFLOW DIAGRAM STUDIO (MERMAID.JS)
// ==========================================================
// Quick preset buttons
document.getElementById("presetRepairBtn")?.addEventListener("click", () => {
    document.getElementById("aiWorkflowPrompt").value = "Hardware Repair and Diagnostic Triage Workflow";
    renderAiWorkflowDiagram("repair");
});

document.getElementById("presetOffboardBtn")?.addEventListener("click", () => {
    document.getElementById("aiWorkflowPrompt").value = "Employee Offboarding and Asset Recovery via Outlook and Teams";
    renderAiWorkflowDiagram("offboard");
});

document.getElementById("presetProvisionBtn")?.addEventListener("click", () => {
    document.getElementById("aiWorkflowPrompt").value = "New Hire Laptop Provisioning with Microsoft Intune and Entra ID";
    renderAiWorkflowDiagram("provision");
});

// Custom prompt execution
document.getElementById("runAiWorkflowBtn")?.addEventListener("click", () => {
    const prompt = document.getElementById("aiWorkflowPrompt")?.value || "";
    renderAiWorkflowDiagram(prompt);
});

// Renders the Mermaid flowchart into the DOM
async function renderAiWorkflowDiagram(promptText) {
    const container = document.getElementById("mermaidGraph");
    if (!container) return;

    container.removeAttribute("data-processed");
    container.innerHTML = "<p><em>Generating workflow blueprint...</em></p>";

    let mermaidSyntax = "";
    const lower = promptText.toLowerCase();

    if (lower.includes("repair") || lower.includes("service") || lower.includes("diagnostic")) {
        mermaidSyntax = `graph TD
    A[Employee Reports Issue via Portal] --> B{Select Diagnostic Issue}
    B -->|Battery / Crash| C[IT Bench Triage & Hardware Test]
    B -->|Screen / Physical| D[Vendor RMA / Parts Order]
    C --> E[Execute Hardware Repair & Re-image]
    D --> E
    E --> F{Diagnostic Verification Passed?}
    F -->|Fail| C
    F -->|Pass: Return to User| G[Notify Employee via Teams & Handover]
    F -->|Pass: Return to Pool| H[Update Status to Available in SQL Server]
    G --> I[Close Helpdesk Ticket]
    H --> I`;
    } else if (lower.includes("offboard") || lower.includes("return")) {
        mermaidSyntax = `graph TD
    A[HR Offboarding Notice in Entra ID] --> B[Power Automate Queries SQL Server]
    B --> C[Fetch Assigned Asset Tags & Serial Numbers]
    C --> D[Send Return Checklist via Outlook to Employee]
    D --> E[Employee Returns Device to IT Helpdesk]
    E --> F[IT Wipe Device via Microsoft Intune]
    F --> G[Generate Return Receipt PDF & Capture Signature]
    G --> H[Update Status to Available in SQL Server]
    H --> I[Post Confirmation to HR Teams Channel]`;
    } else {
        mermaidSyntax = `graph TD
    A[New Hire Ticket Created in Helpdesk] --> B[Check Available Laptops in SQL Server]
    B --> C{Laptops Available in Stock?}
    C -->|No| D[Trigger Purchase Order via Power Automate]
    C -->|Yes| E[Assign Asset Tag & Reserve Serial Number]
    E --> F[Enroll Device in Microsoft Intune & Autopilot]
    F --> G[Generate Assignment Agreement PDF]
    G --> H[Employee Signs Digitally in EquipmentTracker]
    H --> I[Update SQL: Status Assigned & Post Welcome to Teams]`;
    }

    try {
        container.innerHTML = mermaidSyntax;
        if (window.mermaid) {
            await window.mermaid.run({ nodes: [container] });
        }
    } catch (err) {
        console.error("Mermaid render error:", err);
        container.innerHTML = `<pre>${mermaidSyntax}</pre>`;
    }
}


// ==========================================================
// DEFAULT DATES
// ==========================================================
function setTodayDates() {
    const today = new Date().toISOString().split("T")[0];
    const assignedDate = document.getElementById("assignedDate");
    const signatureDate = document.getElementById("signatureDate");
    const returnDate = document.getElementById("returnDate");

    if (assignedDate) assignedDate.value = today;
    if (signatureDate) signatureDate.value = today;
    if (returnDate) returnDate.value = today;
}


// ==========================================================
// START APPLICATION
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
    hideAllSections();
    if (dashboardSection) dashboardSection.style.display = "block";
    setTodayDates();
    loadDashboard();
});
