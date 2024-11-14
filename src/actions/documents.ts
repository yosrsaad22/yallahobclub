'use server';

import { ActionResponse } from '@/types';
import fs from 'fs';
import path from 'path';
import PDFKit from 'pdfkit';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';

const drawRow = (doc: PDFKit.PDFDocument, y: number, columns: string[], columnWidths: number[]) => {
  const xStart = (doc.page.width - columnWidths.reduce((a, b) => a + b, 0)) / 2;

  const rowHeight = 70; // Set a standard row height, increase as needed

  let currentX = xStart;
  columns.forEach((text, i) => {
    doc.font('Times-Roman');

    doc.fontSize(12).text(text, currentX + 5, y + 5, {
      width: columnWidths[i],
      height: rowHeight - 10, // Adjust text height for padding
    });
    currentX += columnWidths[i];
  });

  // Draw vertical borders
  currentX = xStart;
  for (let i = 0; i <= columns.length; i++) {
    doc
      .moveTo(currentX, y)
      .lineTo(currentX, y + rowHeight) // Use the fixed row height
      .stroke();
    if (i < columnWidths.length) {
      currentX += columnWidths[i];
    }
  }

  // Draw horizontal borders for the row
  doc
    .moveTo(xStart, y)
    .lineTo(xStart + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();
  doc
    .moveTo(xStart, y + rowHeight)
    .lineTo(xStart + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
    .stroke();
};

const drawHeader = (
  doc: PDFKit.PDFDocument,
  y: number,
  columns: string[],
  columnWidths: number[],
  backgroundColor: string = '#3cbcc1', // Default to orange
) => {
  const xStart = (doc.page.width - columnWidths.reduce((a, b) => a + b, 0)) / 2;

  // Draw background color for the header
  doc
    .rect(
      xStart,
      y,
      columnWidths.reduce((a, b) => a + b, 0),
      20,
    )
    .fillAndStroke(backgroundColor, '#000');

  // Draw the header text and borders
  let currentX = xStart;
  columns.forEach((text, i) => {
    doc
      .fillColor('black')
      .font('Times-Bold')
      .fontSize(12)
      .text(text, currentX + 5, y + 5, {
        width: columnWidths[i],
        align: 'left',
      });
    currentX += columnWidths[i];
  });

  // Draw vertical borders
  currentX = xStart;
  for (let i = 0; i <= columns.length; i++) {
    doc
      .moveTo(currentX, y)
      .lineTo(currentX, y + 20)
      .stroke();
    if (i < columnWidths.length) {
      currentX += columnWidths[i];
    }
  }

  // Draw horizontal borders
  doc
    .moveTo(xStart, y)
    .lineTo(xStart + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();
  doc
    .moveTo(xStart, y + 20)
    .lineTo(xStart + columnWidths.reduce((a, b) => a + b, 0), y + 20)
    .stroke();
};

function ensureFont(fontName: string) {
  const sourcePath = path.resolve(`public/fonts/${fontName}.afm`);

  const isProd = process.env.NODE_ENV === 'production';
  const destDir = isProd ? path.resolve('.next/server/chunks/data') : path.resolve('.next/server/vendor-chunks/data');

  const destPath = path.join(destDir, `${fontName}.afm`);

  // Skip the operation if in production (fonts already exist)
  if (isProd) {
    console.log(`Skipping font copy in production for ${fontName}`);
    return;
  }

  // Ensure the destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy the font if it doesn't already exist
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${fontName}.afm to ${destPath}`);
  } else {
    console.log(`${fontName}.afm already exists at ${destPath}`);
  }
}

const addHeader = (doc: PDFKit.PDFDocument, title: string, ref: string, version: string, date: string) => {
  const margin = 20;
  const headerHeight = 70;
  const tableWidth = doc.page.width - 2 * margin;
  const columnWidths = [tableWidth * 0.2, tableWidth * 0.6, tableWidth * 0.2];

  // Draw outer table border
  doc.rect(margin, margin, tableWidth, headerHeight).stroke();

  // Draw vertical borders between columns
  let currentX = margin + columnWidths[0];
  doc
    .moveTo(currentX, margin)
    .lineTo(currentX, margin + headerHeight)
    .stroke();

  currentX += columnWidths[1];
  doc
    .moveTo(currentX, margin)
    .lineTo(currentX, margin + headerHeight)
    .stroke();

  // Draw the logo centered vertically in column 1 (smaller size)
  const logoPath = path.resolve('public/img/pdf-logo.jpg');
  if (fs.existsSync(logoPath)) {
    const logoHeight = headerHeight / 2.5; // Decreased size
    const logoY = margin + (headerHeight - logoHeight) / 2; // Vertically centered
    doc.image(logoPath, margin + 10, logoY, {
      width: columnWidths[0] - 25,
      height: logoHeight - 5,
      align: 'center', // Optional: Add alignment if needed
      valign: 'center', // Optional: Add vertical alignment if needed
    });
  }

  // Draw the title in the center column (column 2), vertically centered
  const titleY = margin + (headerHeight - 16) / 2; // Adjust for font size 16
  doc
    .font('Times-Bold')
    .fontSize(12)
    .text(title, margin + columnWidths[0], titleY, {
      width: columnWidths[1],
      align: 'center',
    });

  // Draw the reference, version, and date in individual rows of column 3, centered and bold
  const lastColumnX = margin + columnWidths[0] + columnWidths[1];
  const rowHeight = headerHeight / 3;

  // Reference in the first row
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`REF: ${ref}`, lastColumnX + 5, margin + (rowHeight - 10) / 2, {
      width: columnWidths[2] - 10,
      align: 'left',
    });

  // Version in the second row
  doc.text(`Version: ${version}`, lastColumnX + 5, margin + rowHeight + (rowHeight - 10) / 2, {
    width: columnWidths[2] - 10,
    align: 'left',
  });

  // Date in the third row
  doc.text(`Date: ${date}`, lastColumnX + 5, margin + 2 * rowHeight + (rowHeight - 10) / 2, {
    width: columnWidths[2] - 10,
    align: 'left',
  });

  // Draw horizontal borders for each row in column 3
  for (let i = 1; i <= 2; i++) {
    const y = margin + i * rowHeight;
    doc
      .moveTo(lastColumnX, y)
      .lineTo(lastColumnX + columnWidths[2], y)
      .stroke();
  }
};

const addFooter = (doc: PDFKit.PDFDocument, pageNumber: number, totalPages: number) => {
  const margin = 50; // Left margin for the footer
  const footerY = doc.page.height - 50; // Position of the footer at the bottom

  // Footer text aligned to the left
  const footerText =
    'Ce document est la propriété de ECOMNESS. Il ne peut pas être reproduit ou communiqué sans autorisation.';
  doc
    .font('Times-Roman')
    .fontSize(8)
    .text(footerText, margin, footerY, {
      align: 'left',
      width: doc.page.width - 2 * margin, // Make the text full width
    });

  // Pagination text aligned to the right
  const pageText = `Page ${pageNumber} sur ${totalPages}`;
  doc
    .font('Times-Roman')
    .fontSize(8)
    .text(pageText, margin, footerY, {
      align: 'right',
      width: doc.page.width - 2 * margin, // Make the text full width
    });
};

const drawCenteredTable = (
  doc: PDFKit.PDFDocument,
  data: string[][],
  yStart: number,
  type: 'details' | 'signature',
): number => {
  const tableWidth = 450;
  const columnCount = data[0].length;
  const rowCount = data.length;
  const columnWidth = tableWidth / columnCount;

  // Adjust the height of the first row if it's a signature table
  const rowHeight = type === 'signature' ? 50 : 30;

  const xStart = (doc.page.width - tableWidth) / 2;

  // Draw the top border of the table
  doc
    .moveTo(xStart, yStart)
    .lineTo(xStart + tableWidth, yStart)
    .stroke();

  // Render table cells
  data.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const isGrayBackground = (type === 'details' && colIndex === 0) || (type === 'signature' && rowIndex === 0);

      if (isGrayBackground) {
        doc
          .rect(xStart + colIndex * columnWidth, yStart + rowIndex * rowHeight, columnWidth, rowHeight)
          .fillAndStroke('#d3d3d3', '#000');
      }

      // Calculate vertical alignment
      const textHeight = doc.heightOfString(cell, {
        width: columnWidth,
        align: 'center',
      });
      const textY = yStart + rowIndex * rowHeight + (rowHeight - textHeight) / 2;
      const textX = xStart + colIndex * columnWidth;

      doc.fillColor('black').font('Times-Bold').fontSize(12).text(cell, textX, textY, {
        width: columnWidth,
        align: 'center',
        height: rowHeight,
        ellipsis: true, // Ensure text fits within the cell
      });
    });

    // Draw horizontal line for row boundary
    doc
      .moveTo(xStart, yStart + (rowIndex + 1) * rowHeight)
      .lineTo(xStart + tableWidth, yStart + (rowIndex + 1) * rowHeight)
      .stroke();
  });

  // Draw vertical lines for column boundaries
  for (let col = 0; col <= columnCount; col++) {
    const x = xStart + col * columnWidth;
    doc
      .moveTo(x, yStart)
      .lineTo(x, yStart + rowCount * rowHeight)
      .stroke();
  }

  return yStart + rowCount * rowHeight + 30;
};

export const generateDechargeDoc = async (
  code: string,
  subOrders: any,
  createdAt: Date,
  pickupDate: Date,
): Promise<ActionResponse> => {
  try {
    ensureFont('Helvetica');
    ensureFont('Times-Roman');
    ensureFont('Times-Bold');
    const tColors = await getTranslations('dashboard.colors');
    const doc = new PDFKit({
      size: 'A4',
      margin: 20,
      bufferPages: true,
      userPassword: undefined,
      ownerPassword: undefined,
    });
    const outputPath = 'output.pdf';
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    let yPosition = 0;

    const checkAndAddPage = (doc: PDFKit.PDFDocument) => {
      if (yPosition > doc.page.height - 100) {
        doc.addPage();
      }
    };

    doc.on('pageAdded', () => {
      yPosition = 150;

      // Add header on the new page
      addHeader(doc, `FICHE DE DECHARGE DE COLIS`, 'FCH-01', '01', '01/11/2024');
    });

    // Add the first header
    addHeader(doc, `FICHE DE DECHARGE DE COLIS`, 'FCH-01', '01', '01/11/2024');

    doc.info.Title = 'Decharge';
    doc.font('Times-Roman');

    // Draw the details table
    const detailsData = [
      ['Code du pickup', code],
      ['Date de création du pickup', formatDate(createdAt)],
      ['Date planifiée pour le pickup', formatDate(pickupDate)],
    ];
    yPosition = drawCenteredTable(doc, detailsData, 150, 'details') + 50;

    // Draw product table header
    drawHeader(doc, yPosition, ['ID', 'Client', 'Tél', 'Ville', 'Description', 'COD'], [80, 100, 60, 100, 170, 35]);
    yPosition += 20;

    // Draw product rows
    for (const subOrder of subOrders) {
      checkAndAddPage(doc);
      console.log(subOrder.deliveryId, subOrder.order.firstName + ' ' + subOrder.order.lastName);
      drawRow(
        doc,
        yPosition,
        [
          subOrder.deliveryId,
          subOrder.order.firstName + ' ' + subOrder.order.lastName,
          subOrder.order.number,
          subOrder.order.city,
          subOrder.products
            .map(
              (item: any) =>
                `${item.quantity}*${item.product?.name} ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
            )
            .join(' + '),
          subOrder.products.reduce((total: number, item: any) => total + item.quantity * item.detailPrice, 0) + 8,
          ,
        ],

        [80, 100, 60, 100, 170, 35],
      );
      yPosition += 70;
    }

    // Draw the signature table

    checkAndAddPage(doc);
    const signatureData = [
      ['Établi par', 'Date et Signature'],
      ['', ''],
    ];
    yPosition += 100;

    const requiredHeight = 100; // Estimated height for the signature table

    // Check if there is enough space for the signature table
    if (yPosition + requiredHeight > doc.page.height - 70) {
      doc.addPage(); // Add new page if space is not enough
    }

    const footerText =
      'Veuillez signer ce document afin de confirmer que la décharge a eu lieu et guarantir vos droits ';
    doc
      .font('Times-Roman')
      .fontSize(12)
      .text(footerText, 50, yPosition, {
        align: 'center',
        width: doc.page.width - 2 * 50, // Make the text full width
      });

    drawCenteredTable(doc, signatureData, yPosition + 40, 'signature');

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      addFooter(doc, i + 1, pages.count);
    }

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        const pdfBytes = fs.readFileSync(outputPath);
        resolve({
          success: 'Fiche de décharge généré avec succès',
          data: new Uint8Array(pdfBytes),
        });
      });
      stream.on('error', () =>
        reject({
          error: 'Erreur lors de la génération de la fiche de décharge',
        }),
      );
    });
  } catch (error) {
    console.error(error);
    return { error: 'Erreur lors de la génération de la fiche de décharge' };
  }
};
