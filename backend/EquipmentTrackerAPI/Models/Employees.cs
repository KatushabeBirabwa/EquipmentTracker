namespace EquipmentTrackerAPI.Models;

public class Employees
{
    public int EmployeeID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Department { get; set; }
    public string? JobTitle { get; set; }

    // Add this line to satisfy line 127:
    public string? ManagerName { get; set; }
}
