using EquipmentTrackerAPI.Data;
using EquipmentTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EquipmentTrackerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceTicketsController : ControllerBase
{
    private readonly EquipmentTrackerContext _context;

    public ServiceTicketsController(EquipmentTrackerContext context)
    {
        _context = context;
    }

    // GET: api/servicetickets
    [HttpGet]
    public async Task<ActionResult<IEnumerable<DeviceServiceTicket>>> GetTickets()
    {
        return await _context.DeviceServiceTickets
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();
    }

    // POST: api/servicetickets
    [HttpPost]
    public async Task<ActionResult<DeviceServiceTicket>> CreateTicket([FromBody] DeviceServiceTicket ticket)
    {
        if (string.IsNullOrWhiteSpace(ticket.AssetTag) || string.IsNullOrWhiteSpace(ticket.DiagnosticIssue))
        {
            return BadRequest("Asset Tag and Diagnostic Issue are required.");
        }

        ticket.CreatedDate = DateTime.UtcNow;
        ticket.Status = "In Triage";

        _context.DeviceServiceTickets.Add(ticket);

        // Automatically update the device's status in inventory to 'Under Repair'
        var device = await _context.Devices.FirstOrDefaultAsync(d => d.AssetTag == ticket.AssetTag);
        if (device != null)
        {
            device.Status = "Under Repair";
        }

        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTickets), new { id = ticket.TicketID }, ticket);
    }

    // PUT: api/servicetickets/{id}/resolve
    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> ResolveTicket(int id, [FromBody] ResolveTicketRequest request)
    {
        var ticket = await _context.DeviceServiceTickets.FindAsync(id);
        if (ticket == null)
        {
            return NotFound($"Service ticket {id} not found.");
        }

        ticket.Status = "Solved";
        ticket.TechnicianNotes = request.TechnicianNotes;
        ticket.ResolutionAction = request.ResolutionAction;
        ticket.ResolvedDate = DateTime.UtcNow;

        // Update the physical device status based on the selected resolution
        var device = await _context.Devices.FirstOrDefaultAsync(d => d.AssetTag == ticket.AssetTag);
        if (device != null)
        {
            if (request.ResolutionAction == "ReturnToInventory")
            {
                device.Status = "Available";
            }
            else
            {
                // Return to original assigned user
                device.Status = "Assigned";
            }
        }

        await _context.SaveChangesAsync();
        return Ok(ticket);
    }
}

public class ResolveTicketRequest
{
    public string? TechnicianNotes { get; set; }
    public string ResolutionAction { get; set; } = "ReturnToInventory"; // "ReturnToUser" or "ReturnToInventory"
}
