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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Devices>>> GetDevices()
    {
        return await _context.Devices.ToListAsync();
    }
    // Search devices by employee name, asset tag, or serial number
[HttpGet("search")]
public async Task<ActionResult<IEnumerable<Devices>>> SearchDevices(string value)
{
    // Stop if the search box is empty
    if (string.IsNullOrWhiteSpace(value))
    {
        return BadRequest("Search value is required.");
    }

    // Search the Devices table
    var devices = await _context.Devices
        .Where(device =>
            device.AssetTag.Contains(value) ||
            device.SerialNumber.Contains(value) ||
            device.Model.Contains(value))
        .ToListAsync();

    // Return the matching devices
    return Ok(devices);
}

}

