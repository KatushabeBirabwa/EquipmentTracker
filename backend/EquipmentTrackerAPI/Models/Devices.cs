using System.ComponentModel.DataAnnotations;

namespace EquipmentTrackerAPI.Models;

public class Devices
{
    [Key]
    public int DeviceID { get; set; }

    public string AssetTag { get; set; } = string.Empty;
    public string SerialNumber { get; set; } = string.Empty;
    public string EquipmentType { get; set; } = string.Empty;
    public string Manufacturer { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;

    public DateTime? PurchaseDate { get; set; }
    public DateTime? WarrantyEndDate { get; set; }
    public DateTime? EndOfLifeDate { get; set; }

    public DateTime? CreatedDate { get; set; }
}