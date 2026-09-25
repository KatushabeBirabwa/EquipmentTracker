namespace EquipmentTrackerAPI.Models;

public class EmployeeDeviceSearchResult
{
    // Employee details
    public int? EmployeeID { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Department { get; set; }
    public string? ManagerName { get; set; }

    // Device details
    public int? DeviceID { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string EquipmentType { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string DeviceStatus { get; set; } = string.Empty;

    // Assignment custody details
    public int? AssignmentID { get; set; }
    public DateTime? AssignedDate { get; set; }
    public string? AssignmentStatus { get; set; }
}
