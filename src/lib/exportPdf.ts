import jsPDF from 'jspdf';
import autoTable, { type ColumnInput } from 'jspdf-autotable';

export interface ExportColumn {
  header: string;
  dataKey: string;
}

export function exportPdf(filename: string, title: string, columns: ExportColumn[], rows: Record<string, any>[]): void {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Car Washing Admin', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(title, pageWidth / 2, 30, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, pageWidth / 2, 37, { align: 'center' });

  doc.setTextColor(0);

  // Auto-table
  const cols: ColumnInput[] = columns.map((c) => ({ header: c.header, dataKey: c.dataKey }));
  autoTable(doc, {
    columns: cols,
    body: rows,
    startY: 44,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [41, 43, 47], fontSize: 8, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    margin: { top: 44 },
  });

  doc.save(filename);
}
