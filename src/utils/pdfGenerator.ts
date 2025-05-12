import { jsPDF } from 'jspdf';
import { StudentData } from '../types';
import QRCode from 'qrcode';

export const generatePDF = async (students: StudentData[]): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    try {
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      
      // Set up page dimensions
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const cardWidth = 85; // Increased width
      const cardHeight = 30; // Adjusted height for 5 rows
      const categoryHeight = 8;
      const spacing = 8; // Slightly reduced spacing to accommodate larger cards

      // Add watermark
      const watermark = "KPRIET STUDENT CARD";
      pdf.setFontSize(30);
      pdf.setTextColor(200, 200, 200);
      pdf.setFont("helvetica", "bold");
      pdf.text(watermark, pageWidth/2, pageHeight/2, {
        angle: 45,
        align: 'center'
      });

      // Add header to first page
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text("KPRIET Student Identity Cards 2028", pageWidth/2, 10, { align: 'center' });
      pdf.setFontSize(12);

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        
        if (i > 0 && i % 12 === 0) { // Changed from 12 to 10 (2x5 layout)
          pdf.addPage();
          // Add watermark to new page
          pdf.setFontSize(30);
          pdf.setTextColor(200, 200, 200);
          pdf.text(watermark, pageWidth/2, pageHeight/2, {
            angle: 45,
            align: 'center'
          });
        }

        const position = i % 12; // Changed from 12 to 10
        const row = Math.floor(position / 2);
        const col = position % 2;

        const x = margin + col * (cardWidth + spacing);
        const y = margin + row * (cardHeight + spacing);

        // Generate QR code
        const qrData = `ID:${student['AD NO']},Name:${student['Student Name']},Dept:${student.Dept}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, { width: 15 });

        // Draw decorative border
        pdf.setDrawColor(0, 71, 171);
        pdf.setLineWidth(0.8);
        pdf.rect(x-1, y-1, cardWidth+2, cardHeight+2);
        pdf.setLineWidth(0.3);
        pdf.rect(x-2, y-2, cardWidth+4, cardHeight+4);

        // Card content
        pdf.setDrawColor(0);
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, cardWidth, cardHeight);

        // Left pink section
        pdf.setFillColor(255, 192, 203);
        const leftWidth = cardWidth * 0.38; // Increased left section width
        pdf.rect(x, y, leftWidth, cardHeight, 'F');

        // Right section
        pdf.setFillColor(240, 255, 240);
        pdf.rect(x + leftWidth, y, cardWidth - leftWidth, cardHeight, 'F');

        // Vertical divider
        pdf.setDrawColor(0);
        pdf.line(x + leftWidth, y, x + leftWidth, y + cardHeight);

        // Add QR code
        const qrSize = 10;
        const qrX = x + cardWidth - qrSize - 2; // 2mm padding from the right
        const qrY = y + cardHeight - qrSize - 2; // 2mm padding from the bottom
        pdf.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

        // Left section text (vertical)
        pdf.setTextColor(0);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        const yearX = x + 8;
        pdf.text("2024 - 2028", yearX, y + cardHeight - 4, {
          angle: 90,
          align: 'left'
        });

        // AD NO (vertical)
        pdf.setFontSize(17); // Increased font size
        pdf.setFont("helvetica", "bold");
        const adNoX = x + 18; // Adjusted position
        pdf.text(student['AD NO'].toString(), adNoX, y + cardHeight - 5, {
          angle: 90,
          align: 'left'
        });

        // Right section content
        const rightX = x + leftWidth + 5;
        
        // Student Name with dynamic sizing
let studentName = student['Student Name'];
let fontSize = 12;
pdf.setFontSize(fontSize);
pdf.setFont("helvetica", "bold");

let nameY = y + 10;
const firstLine = studentName.substring(0, 16);
const secondLine = studentName.length > 16 ? studentName.substring(16) : '';

pdf.text(firstLine, rightX, nameY);
if (secondLine) {
  pdf.text(secondLine, rightX, nameY + fontSize - 7.8); // reduced spacing
}




        // Quota/dept
        pdf.setFontSize(12);
        pdf.text(`${student.Quota}/${student.Dept}`, rightX, y + 19);

        // COMM/TYPE
        pdf.setFontSize(12);
        const category = `${student.COMM}${student.TYPE ? '/ ' + student.TYPE : '/'}`;
        pdf.text(category, rightX, y + 25);

        // Add card serial number
        // pdf.setFontSize(6);
        // pdf.text(`SN: ${(i + 1).toString().padStart(4, '0')}`, x + cardWidth - 20, y + cardHeight - 1);
      }

      // Add page numbers
      const pageCount = pdf.getNumberOfPages();
      for(let j = 1; j <= pageCount; j++) {
        pdf.setPage(j);
        pdf.setFontSize(10);
        pdf.setTextColor(0);
        pdf.text(`Page ${j} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
      }

      const blob = pdf.output('blob');
      resolve(blob);
    } catch (error) {
      reject(error);
    }
  });
};