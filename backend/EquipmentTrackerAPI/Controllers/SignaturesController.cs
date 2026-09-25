using EquipmentTrackerAPI.Data;
using EquipmentTrackerAPI.Models;
using Microsoft.AspNetCore.Mvc;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;

namespace EquipmentTrackerAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignaturesController : ControllerBase
    {
        private readonly EquipmentTrackerContext _context;
        private readonly IWebHostEnvironment _environment;

        public SignaturesController(
            EquipmentTrackerContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // ==========================================
        // GET SIGNATURE
        // GET: api/signatures/1
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Signature>> GetSignature(int id)
        {
            var signature = await _context.Signatures.FindAsync(id);

            if (signature == null)
            {
                return NotFound();
            }

            return signature;
        }

        // ==========================================
        // SIGN EQUIPMENT FORM
        // PUT: api/signatures/1/sign
        // ==========================================
        [HttpPut("{id}/sign")]
        public async Task<IActionResult> SignDocument(
            int id,
            Signature signRequest)
        {
            // 1. Find the signature record
            var signature = await _context.Signatures.FindAsync(id);

            if (signature == null)
            {
                return NotFound();
            }

            // 2. Validate that signature data was supplied
            if (string.IsNullOrWhiteSpace(signRequest.SignatureData))
            {
                return BadRequest("Employee signature is required.");
            }

            // Update employee name if supplied
            if (!string.IsNullOrWhiteSpace(signRequest.EmployeeName))
            {
                signature.EmployeeName = signRequest.EmployeeName.Trim();
            }

            // Update signature status and timestamp
            signature.SignatureData = signRequest.SignatureData.Trim();
            signature.SignatureStatus = "Signed";
            signature.SignedDate = DateTime.Now;

            // ==========================================================
            // AUTOMATIC DASHBOARD SYNC: FLIP DEVICE STATUS TO 'ASSIGNED'
            // ==========================================================
            // Look up the assignment linked to this signature
            var assignment = await _context.Assignments.FindAsync(signature.AssignmentID);
            if (assignment != null)
            {
                assignment.AssignmentStatus = "Assigned";

                // Look up the specific device and mark it as Assigned
                var device = await _context.Devices.FindAsync(assignment.DeviceID);
                if (device != null)
                {
                    device.Status = "Assigned";
                }
            }

            // ======================================
            // CREATE SIGNED DOCUMENT FOLDER & PDF
            // ======================================
            string documentFolder = Path.Combine(
                _environment.ContentRootPath,
                "SignedDocuments"
            );

            Directory.CreateDirectory(documentFolder);

            string safeEmployeeName = (signature.EmployeeName ?? "Employee").Replace(" ", "_");
            string fileName = $"{safeEmployeeName}_Assignment_{signature.AssignmentID}.pdf";
            string fullFilePath = Path.Combine(documentFolder, fileName);

            CreateSignedEquipmentPdf(signature, fullFilePath);

            // Save relative document path in SQL
            signature.SignedDocumentPath = $"SignedDocuments/{fileName}";

            // ==========================================================
            // ATOMIC SAVE: Commits signature, assignment & device status
            // ==========================================================
            await _context.SaveChangesAsync();

            return Ok(signature);
        }

        // ==========================================
        // VIEW SIGNED PDF
        // GET: api/signatures/1/document
        // ==========================================
        [HttpGet("{id}/document")]
        public async Task<IActionResult> GetSignedDocument(int id)
        {
            var signature = await _context.Signatures.FindAsync(id);

            if (signature == null)
            {
                return NotFound();
            }

            if (string.IsNullOrWhiteSpace(signature.SignedDocumentPath))
            {
                return NotFound("No signed document exists.");
            }

            string fullPath = Path.Combine(
                _environment.ContentRootPath,
                signature.SignedDocumentPath
            );

            if (!System.IO.File.Exists(fullPath))
            {
                return NotFound("Signed PDF file was not found.");
            }

            return PhysicalFile(
                fullPath,
                "application/pdf",
                Path.GetFileName(fullPath)
            );
        }

        // ==========================================
        // CREATE PDF HELPER
        // ==========================================
        private void CreateSignedEquipmentPdf(Signature signature, string filePath)
        {
            PdfDocument document = new PdfDocument();
            PdfPage page = document.AddPage();
            XGraphics graphics = XGraphics.FromPdfPage(page);

            XFont titleFont = new XFont("Arial", 18, XFontStyle.Bold);
            XFont headingFont = new XFont("Arial", 12, XFontStyle.Bold);
            XFont normalFont = new XFont("Arial", 11, XFontStyle.Regular);

            double left = 50;
            double top = 50;

            // Title
            graphics.DrawString(
                "Equipment Assignment Agreement",
                titleFont,
                XBrushes.Black,
                new XPoint(left, top)
            );

            top += 50;
            graphics.DrawString($"Employee: {signature.EmployeeName}", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 25;
            graphics.DrawString($"Assignment ID: {signature.AssignmentID}", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 25;
            graphics.DrawString($"Status: {signature.SignatureStatus}", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 25;
            graphics.DrawString($"Signed Date: {signature.SignedDate}", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 50;
            graphics.DrawString("Acknowledgment", headingFont, XBrushes.Black, new XPoint(left, top));

            top += 30;
            graphics.DrawString("I confirm that I received the equipment assigned to me.", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 20;
            graphics.DrawString("I understand that the equipment remains the property", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 20;
            graphics.DrawString("of the organization and must be returned when requested.", normalFont, XBrushes.Black, new XPoint(left, top));

            top += 50;
            graphics.DrawString("Employee Signature:", headingFont, XBrushes.Black, new XPoint(left, top));

            top += 30;
            graphics.DrawString(signature.SignatureData ?? "", normalFont, XBrushes.Black, new XPoint(left, top));

            document.Save(filePath);
        }
    }
}
