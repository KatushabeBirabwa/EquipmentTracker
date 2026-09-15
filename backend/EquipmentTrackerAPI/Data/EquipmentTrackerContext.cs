using EquipmentTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace EquipmentTrackerAPI.Data;

public class EquipmentTrackerContext : DbContext
{
    public EquipmentTrackerContext(
        DbContextOptions<EquipmentTrackerContext> options) : base(options)
    {
    }

    public DbSet<Devices> Devices { get; set; }
    public DbSet<Signature> Signatures { get; set; }

}