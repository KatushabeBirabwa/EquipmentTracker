using EquipmentTrackerAPI.Data;
using EquipmentTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EquipmentTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DevicesController : ControllerBase
{
    private readonly EquipmentTrackerContext _context;

    public DevicesController(EquipmentTrackerContext context)
    {
        _context = context;
    }

    // ==========================================================
    // 1. GET ALL DEVICES
    // GET: api/devices
    // ==========================================================
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Devices>>> GetDevices()
    {
        return await _context.Devices.ToListAsync();
    }

    // ==========================================================
    // 2. GET DEVICES BY STATUS
    // GET: api/devices/status/Available
    // ==========================================================
    [HttpGet("status/{status}")]
    public async Task<ActionResult<IEnumerable<Devices>>> GetDevicesByStatus(string status)
    {
        var clean = status.Trim().ToLower();
        return await _context.Devices
            .Where(d => d.Status != null && d.Status.ToLower() == clean)
            .ToListAsync();
    }

    // ==========================================================
    // 3. DEVICE SEARCH (BY ASSET TAG, SERIAL, MODEL, OR TYPE)
    // GET: api/devices/search?value=laptop
    // ==========================================================
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Devices>>> SearchDevices(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return BadRequest("Search value is required.");
        }

        var clean = value.Trim().ToLower();

        var devices = await _context.Devices
            .Where(device =>
                (device.AssetTag != null && device.AssetTag.ToLower().Contains(clean)) ||
                (device.SerialNumber != null && device.SerialNumber.ToLower().Contains(clean)) ||
                (device.Model != null && device.Model.ToLower().Contains(clean)) ||
                (device.EquipmentType != null && device.EquipmentType.ToLower().Contains(clean)))
            .ToListAsync();

        return Ok(devices);
    }

    // ==========================================================
    // 4. UNIFIED SEARCH: EMPLOYEES & DEVICES
    // GET: api/devices/unified-search?query=John
    // Joins Devices -> Assignments -> Employees for custody info
    // ==========================================================
    [HttpGet("unified-search")]
    public async Task<ActionResult<IEnumerable<EmployeeDeviceSearchResult>>> UnifiedSearch([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Search query cannot be empty.");
        }

        var clean = query.Trim().ToLower();

        var queryable = (
            from device in _context.Devices
            join assignment in _context.Assignments 
                on device.DeviceID equals assignment.DeviceID into devAssignments
            from assignment in devAssignments.DefaultIfEmpty()

            join employee in _context.Employees 
                on (assignment != null ? assignment.EmployeeID : 0) equals employee.EmployeeID into empAssignments
            from employee in empAssignments.DefaultIfEmpty()

            where
                (device.AssetTag != null && device.AssetTag.ToLower().Contains(clean)) ||
                (device.SerialNumber != null && device.SerialNumber.ToLower().Contains(clean)) ||
                (device.Model != null && device.Model.ToLower().Contains(clean)) ||
                (device.EquipmentType != null && device.EquipmentType.ToLower().Contains(clean)) ||
                (device.Status != null && device.Status.ToLower().Contains(clean)) ||
                (employee != null && (
                    (employee.FirstName != null && employee.FirstName.ToLower().Contains(clean)) ||
                    (employee.LastName != null && employee.LastName.ToLower().Contains(clean)) ||
                    ((employee.FirstName + " " + employee.LastName).ToLower().Contains(clean)) ||
                    (employee.Email != null && employee.Email.ToLower().Contains(clean)) ||
                    (employee.Department != null && employee.Department.ToLower().Contains(clean))
                ))
            select new EmployeeDeviceSearchResult
            {
                DeviceID = device.DeviceID,
                AssetTag = device.AssetTag ?? "",
                SerialNumber = device.SerialNumber ?? "",
                EquipmentType = device.EquipmentType ?? "",
                Manufacturer = device.Manufacturer ?? "",
                Model = device.Model ?? "",
                DeviceStatus = device.Status ?? "Available",
                AssignmentID = assignment != null ? assignment.AssignmentID : (int?)null,
                AssignedDate = assignment != null ? assignment.AssignedDate : (DateTime?)null,
                // Uses assignment.Status rather than AssignmentStatus
                AssignmentStatus = assignment != null ? (assignment.AssignmentStatus ?? "Assigned") : "Unassigned",
                EmployeeID = employee != null ? employee.EmployeeID : (int?)null,
                EmployeeName = employee != null ? (employee.FirstName + " " + employee.LastName).Trim() : "None (In Inventory)",
                Email = employee != null ? (employee.Email ?? "-") : "-",
                Department = employee != null ? (employee.Department ?? "-") : "-"
            }
        );

        var results = await queryable.Take(50).ToListAsync();
        return Ok(results);
    }
}

// DTO for Unified Search Results
public class EmployeeDeviceSearchResult
{
    public int DeviceID { get; set; }
    public string AssetTag { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string EquipmentType { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string DeviceStatus { get; set; } = string.Empty;
    public int? AssignmentID { get; set; }
    public DateTime? AssignedDate { get; set; }
    public string AssignmentStatus { get; set; } = string.Empty;
    public int? EmployeeID { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
}
