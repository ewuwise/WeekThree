import 'jspdf-autotable';

import { jsPDF } from 'jspdf';

const PDFExporter = ({ transactions }) => {
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add BMT Logo (base64 encoded)
    const logo = 'data:image/png;base64,...'; // Your logo here
    doc.addImage(logo, 'PNG', 14, 10, 30, 10);
    
    // Title
    doc.setFontSize(16);
    doc.setTextColor(46, 69, 226); // BMT blue
    doc.text('BurnAndMintToken Transaction History', 50, 20);
    
    // Metadata
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);
    doc.text(`Total Transactions: ${transactions.length}`, 14, 40);
    
    // Table
    doc.autoTable({
      head: [['Tx Hash', 'From', 'To', 'Value (BMT)', 'Timestamp']],
      body: transactions.map(tx => [
        tx.hash.slice(0, 10) + '...',
        tx.from.slice(0, 8) + '...',
        tx.to?.slice(0, 8) + '...' || 'Burn',
        tx.value,
        tx.timestamp
      ]),
      startY: 50,
      styles: {
        cellPadding: 3,
        fontSize: 8,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [46, 69, 226], // BMT blue
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      }
    });
    
    // Footer
    const pages = doc.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pages} | BMTverse.io`,
        doc.internal.pageSize.width - 40,
        doc.internal.pageSize.height - 10
      );
    }
    
    doc.save(`BMT_Transactions_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <button onClick={exportToPDF} className="pdf-export">
      Export as PDF
    </button>
  );
};

export default PDFExporter;
