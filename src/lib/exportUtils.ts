import jsPDF from 'jspdf';

type Cell = string | number | null | undefined;
type Row = Cell[];

const sanitize = (value: Cell) => (value === null || value === undefined ? '' : String(value));

export const exportToCSV = (filename: string, headers: string[], rows: Row[]) => {
  const headerLine = headers.join(',');
  const bodyLines = rows.map((row) =>
    row
      .map((cell) => {
        const text = sanitize(cell).replace(/"/g, '""');
        return `"${text}"`;
      })
      .join(',')
  );

  const content = [headerLine, ...bodyLines].join('\n');
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  const safeName = filename.endsWith('.csv') || filename.endsWith('.xls') ? filename : `${filename}.csv`;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const renderHeader = (doc: jsPDF, headers: string[], startX: number, startY: number, colWidth: number) => {
  doc.setFont(undefined, 'bold');
  headers.forEach((header, index) => {
    doc.text(String(header), startX + index * colWidth, startY, { maxWidth: colWidth - 6 });
  });
  doc.setFont(undefined, 'normal');
};

export const exportToPDF = (filename: string, title: string, headers: string[], rows: Row[]) => {
  const doc = new jsPDF({ unit: 'pt' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36;
  const colWidth = (pageWidth - margin * 2) / Math.max(headers.length, 1);

  let y = margin + 12;

  doc.setFontSize(16);
  doc.text(title, margin, y);
  y += 20;

  doc.setFontSize(10);
  renderHeader(doc, headers, margin, y, colWidth);
  y += 14;

  rows.forEach((row) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin + 12;
      renderHeader(doc, headers, margin, y, colWidth);
      y += 14;
    }

    row.forEach((cell, index) => {
      doc.text(sanitize(cell), margin + index * colWidth, y, { maxWidth: colWidth - 6 });
    });
    y += 14;
  });

  const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  doc.save(safeName);
};
