namespace EquipmentTrackerAPI.Models
{
    public class Signature
    {
        public int SignatureID { get; set; }
        public int AssignmentID { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime? SignedDate { get; set; }
        public string SignatureStatus { get; set; } = "Pending";
        public string? SignatureData { get; set; }
        public string? SignedDocumentPath { get; set; }
    }
}