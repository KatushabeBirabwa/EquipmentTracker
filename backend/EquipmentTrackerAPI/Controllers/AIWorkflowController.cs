using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace EquipmentTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AIWorkflowController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AIWorkflowController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("generate-diagram")]
    public async Task<IActionResult> GenerateDiagram([FromBody] AIWorkflowRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Prompt))
        {
            return BadRequest(new { message = "Prompt cannot be empty." });
        }

        string userPrompt = request.Prompt.Trim().ToLowerInvariant();

        // 1. Check if Azure OpenAI / OpenAI key is configured
        string? openAiKey = _configuration["AzureOpenAI:ApiKey"] ?? _configuration["OpenAI:ApiKey"];
        
        // If an API key is present, call OpenAI / Azure OpenAI endpoint
        if (!string.IsNullOrEmpty(openAiKey))
        {
            try
            {
                // Placeholder for your Azure OpenAI / Semantic Kernel call
                // If you want live LLM streaming/calls here, it calls the chat completion endpoint
            }
            catch (Exception ex)
            {
                // Fallback gracefully so demo never breaks
            }
        }

        // 2. Intelligent IT Workflow Diagram Generator (Safe Demo Mode)
        var response = GenerateWorkflowFromTemplate(userPrompt);

        await Task.Delay(300); // Simulate realistic LLM inference latency
        return Ok(response);
    }

    private AIWorkflowResponse GenerateWorkflowFromTemplate(string prompt)
    {
        if (prompt.Contains("repair") || prompt.Contains("battery") || prompt.Contains("hardware") || prompt.Contains("service") || prompt.Contains("diagnostic"))
        {
            return new AIWorkflowResponse
            {
                DiagramCode = @"graph TD
    A([User Reports Hardware Fault]) --> B[IT Helpdesk Diagnostic Intake]
    B --> C{Diagnostic Triage}
    C -->|Battery/Screen Repair| D[Order OEM Parts / Dispatch to Tech]
    C -->|Unrepairable / EOL| E[Decommission Device & Update Asset Record]
    C -->|Software / Driver Crash| F[Re-image Device via Intune/Autopilot]
    D --> G[Quality Inspection & Testing]
    F --> G
    G --> H{Resolution Action}
    H -->|Return to User| I[Deliver Device & Capture Digital Signature]
    H -->|Surplus / Spare| J[Return to Available Inventory Pool]
    I --> K([Ticket Solved & Logged in SQL])
    J --> K",
                MermaidCode = @"graph TD
    A([User Reports Hardware Fault]) --> B[IT Helpdesk Diagnostic Intake]
    B --> C{Diagnostic Triage}
    C -->|Battery/Screen Repair| D[Order OEM Parts / Dispatch to Tech]
    C -->|Unrepairable / EOL| E[Decommission Device & Update Asset Record]
    C -->|Software / Driver Crash| F[Re-image Device via Intune/Autopilot]
    D --> G[Quality Inspection & Testing]
    F --> G
    G --> H{Resolution Action}
    H -->|Return to User| I[Deliver Device & Capture Digital Signature]
    H -->|Surplus / Spare| J[Return to Available Inventory Pool]
    I --> K([Ticket Solved & Logged in SQL])
    J --> K",
                Explanation = "Automated Hardware Service & Triage Pipeline integrated with MS Intune and EquipmentTracker asset status management.",
                SuggestedAutomations = new[]
                {
                    "Trigger Power Automate flow on DeviceStatus == 'Under Repair'",
                    "Notify employee via Teams Adaptive Card when repair is complete",
                    "Auto-generate disposal certificate for EOL equipment in SharePoint"
                }
            };
        }
        else if (prompt.Contains("offboard") || prompt.Contains("exit") || prompt.Contains("terminate"))
        {
            return new AIWorkflowResponse
            {
                DiagramCode = @"graph TD
    A([HR Submits Employee Offboarding Notice]) --> B[Query SQL for Assigned Assets]
    B --> C[Generate Return Request & Prepaid Shipping Label]
    C --> D[Send Reminder to Employee via M365 Outlook]
    D --> E{Hardware Received in IT?}
    E -->|No / Past Due| F[Escalate to Department Manager via Teams]
    E -->|Yes| G[Inspect Device Condition]
    G --> H[Remote Wipe via Microsoft Intune]
    H --> I[Update SQL Asset Status: Available]
    I --> J([Offboarding Workflow Complete])",
                MermaidCode = @"graph TD
    A([HR Submits Employee Offboarding Notice]) --> B[Query SQL for Assigned Assets]
    B --> C[Generate Return Request & Prepaid Shipping Label]
    C --> D[Send Reminder to Employee via M365 Outlook]
    D --> E{Hardware Received in IT?}
    E -->|No / Past Due| F[Escalate to Department Manager via Teams]
    E -->|Yes| G[Inspect Device Condition]
    G --> H[Remote Wipe via Microsoft Intune]
    H --> I[Update SQL Asset Status: Available]
    I --> J([Offboarding Workflow Complete])",
                Explanation = "M365 & SQL automated offboarding protocol, ensuring zero equipment loss during employee departures.",
                SuggestedAutomations = new[]
                {
                    "Trigger Microsoft Graph webhook on Entra ID user deactivation",
                    "Sync wipe confirmation from Intune directly to dbo.DeviceHistory"
                }
            };
        }
        else
        {
            // Default Onboarding & Assignment workflow
            return new AIWorkflowResponse
            {
                DiagramCode = @"graph TD
    A([New Hire Request Submitted]) --> B[Check SQL Inventory for Available Device]
    B --> C{Stock Available?}
    C -->|No| D[Trigger Automated Purchase Order via Power Automate]
    C -->|Yes| E[Assign Asset Tag to Employee ID]
    D --> E
    E --> F[Autopilot Provisioning Profile Applied]
    F --> G[Employee Receives Device & Signs Acceptance]
    G --> H[Store Base64 Signature in SQL Signatures Table]
    H --> I([Device Active & Monitored])",
                MermaidCode = @"graph TD
    A([New Hire Request Submitted]) --> B[Check SQL Inventory for Available Device]
    B --> C{Stock Available?}
    C -->|No| D[Trigger Automated Purchase Order via Power Automate]
    C -->|Yes| E[Assign Asset Tag to Employee ID]
    D --> E
    E --> F[Autopilot Provisioning Profile Applied]
    F --> G[Employee Receives Device & Signs Acceptance]
    G --> H[Store Base64 Signature in SQL Signatures Table]
    H --> I([Device Active & Monitored])",
                Explanation = "End-to-end device provisioning and assignment workflow with digital signature verification.",
                SuggestedAutomations = new[]
                {
                    "Automated Power Automate approval for requests exceeding $2,000",
                    "Email digital sign-off PDF copy to employee and manager"
                }
            };
        }
    }
}

public class AIWorkflowRequest
{
    public string Prompt { get; set; } = string.Empty;
}

public class AIWorkflowResponse
{
    [JsonPropertyName("diagramCode")]
    public string DiagramCode { get; set; } = string.Empty;

    [JsonPropertyName("mermaidCode")]
    public string MermaidCode { get; set; } = string.Empty;

    [JsonPropertyName("explanation")]
    public string Explanation { get; set; } = string.Empty;

    [JsonPropertyName("suggestedAutomations")]
    public string[] SuggestedAutomations { get; set; } = Array.Empty<string>();
}
