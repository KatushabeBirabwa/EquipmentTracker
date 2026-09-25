using System.ComponentModel.DataAnnotations;

namespace EquipmentTrackerAPI.Models;

public class Assignments
{
    [Key]
    public int AssignmentID { get; set; }

    public int DeviceID { get; set; }
    public int EmployeeID { get; set; }
    public DateTime? AssignedDate { get; set; }
    public DateTime? ReturnDate { get; set; }
    public string? AssignmentStatus { get; set; }
}
