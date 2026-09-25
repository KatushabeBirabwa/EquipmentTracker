using EquipmentTrackerAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace EquipmentTrackerAPI.Data;

public class EquipmentTrackerContext : DbContext
{
    public EquipmentTrackerContext(
        DbContextOptions<EquipmentTrackerContext> options) : base(options)
    {
    }

    // Existing tables in your app
    public DbSet<Devices> Devices { get; set; }
    public DbSet<Signature> Signatures { get; set; }

    // Required for the Unified Employee & Device Search
    public DbSet<Employees> Employees { get; set; }
    public DbSet<Assignments> Assignments { get; set; }
    public DbSet<DeviceServiceTicket> DeviceServiceTickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Devices>().HasKey(d => d.DeviceID);
    modelBuilder.Entity<Assignments>().HasKey(a => a.AssignmentID);
    modelBuilder.Entity<Employees>().HasKey(e => e.EmployeeID);
}


}

