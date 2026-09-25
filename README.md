\# IT Equipment Tracker



A full-stack IT equipment management application built to track company devices, assignments, returns, signatures, and equipment lifecycle records.



\## Features



\- Equipment inventory dashboard

\- Track available and assigned devices

\- Assign equipment to employees

\- Record equipment returns

\- Search equipment and employee records

\- Capture assignment signatures

\- Track asset tag, serial number, manufacturer, model, and status

\- ASP.NET Core Web API backend

\- SQL Server database integration



\## Technologies



\### Frontend

\- HTML

\- CSS

\- JavaScript



\### Backend

\- C#

\- ASP.NET Core Web API

\- Entity Framework Core



\### Database

\- Microsoft SQL Server



\## Project Structure



```text

EquipmentTracker/

├── frontend/

├── backend/

│   └── EquipmentTrackerAPI/

├── database/

├── README.md

└── .gitignore

# EquipmentTracker

I built this project to solve a real day-to-day problem in IT operations: tracking computer hardware, keeping a clear chain of custody when loaning or assigning devices, and handling service triage when gear breaks. 

Coming from an IT helpdesk background, I wanted a full-stack tool that connects our hardware inventory with automated workflow diagrams so technicians and managers can see both device status and process flows at a glance.

---

## What It Does

- **Real-Time Inventory & Status:** Tracks total, available, assigned, returned, and repair-status equipment. When an asset is assigned or serviced, the numbers update across the board.
- **AI Workflow Studio:** Generates interactive process diagrams (Mermaid.js) for routine IT operations like device onboarding, repair triage, and employee offboarding. This helps teams standardize SOPs and model logic for Power Automate or Azure workflows.
- **Digital Signatures & Custody:** Captures signatures on handoff so there is an audit trail showing who accepted the device and when.
- **Hardware Service & Triage:** Lets technicians log diagnostics, add notes, and return serviced devices back to active inventory.
- **Unified Search:** Search across serial numbers, asset tags, employee names, and departments in one bar.

---

## Tech Stack

- **Backend:** C# / ASP.NET Core Web API (.NET 8)
- **Database:** Microsoft SQL Server with Entity Framework Core
- **Workflows & Diagrams:** Mermaid.js, AI Workflow Controller
- **Frontend:** JavaScript, HTML5 Canvas, CSS
- **Enterprise Direction:** Structured to tie into Microsoft 365, Microsoft Graph, and Power Platform automations.

---

## How to Run It Locally

### 1. Database
Run the script in `database/EquipmentTracker.sql` in SQL Server Management Studio (SSMS) to set up the tables and demo data.

### 2. Start the API
```bash
cd backend/EquipmentTrackerAPI
dotnet run
