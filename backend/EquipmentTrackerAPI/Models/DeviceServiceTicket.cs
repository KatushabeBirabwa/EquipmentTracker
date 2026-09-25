using System.ComponentModel.DataAnnotations;

namespace EquipmentTrackerAPI.Models;

public class DeviceServiceTicket
{
    [Key]
    public int TicketID { get; set; }

    public int DeviceID { get; set; }

    [Required]
    public string AssetTag { get; set; } = string.Empty;

    [Required]
    public string DiagnosticIssue { get; set; } = string.Empty; // e.g. "Battery Failing", "Display Issue", "OS Crash"

    public string Description { get; set; } = string.Empty;

    public string ReportedBy { get; set; } = string.Empty;

    public string Status { get; set; } = "Reported"; // "Reported", "In Triage", "Solved"

    public string? TechnicianNotes { get; set; }

    public string? ResolutionAction { get; set; } // "ReturnToUser" or "ReturnToInventory"

    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedDate { get; set; }
}
