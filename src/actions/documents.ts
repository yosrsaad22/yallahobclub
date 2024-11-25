'use server';

import { ActionResponse } from '@/types';
import fs from 'fs';
import path from 'path';
import PDFKit from 'pdfkit';
import { formatDate } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import bwipjs from 'bwip-js';

const drawRow = (
  doc: PDFKit.PDFDocument,
  y: number,
  columns: string[],
  columnWidths: number[],
  fontSize: number = 12,
  options: { bold?: boolean; underline?: boolean } = {},
) => {
  const xStart = doc.page.margins.left;
  const rowHeight = 30; // Adjust as needed

  let currentX = xStart;

  // Set stroke color and line width for borders
  doc.strokeColor('black').lineWidth(1);

  // Draw horizontal top border
  doc
    .moveTo(xStart, y)
    .lineTo(xStart + columnWidths.reduce((a, b) => a + b, 0), y)
    .stroke();

  columns.forEach((text, i) => {
    // Apply bold and underline if specified
    if (options.bold) {
      doc.font('Helvetica-Bold');
    } else {
      doc.font('Helvetica');
    }

    if (options.underline) {
      doc.fontSize(fontSize).text(text, currentX + 5, y + 5, {
        width: columnWidths[i] - 10,
        align: 'left',
        underline: true,
      });
    } else {
      doc.fontSize(fontSize).text(text, currentX + 5, y + 5, {
        width: columnWidths[i] - 10,
        align: 'left',
      });
    }

    // Draw vertical borders
    doc
      .moveTo(currentX, y)
      .lineTo(currentX, y + rowHeight)
      .stroke();
    currentX += columnWidths[i];
  });

  // Draw the last vertical border
  doc
    .moveTo(currentX, y)
    .lineTo(currentX, y + rowHeight)
    .stroke();

  // Draw horizontal bottom border
  doc
    .moveTo(xStart, y + rowHeight)
    .lineTo(xStart + columnWidths.reduce((a, b) => a + b, 0), y + rowHeight)
    .stroke();

  // Reset font to regular after row
  doc.font('Helvetica').fontSize(10);
};

const drawHeader = (
  doc: PDFKit.PDFDocument,
  y: number,
  columns: string[],
  columnWidths: number[],
  backgroundColor: string = '#3cbcc1', // Default to orange
) => {
  const xStart = doc.page.margins.left;
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
      .font('Helvetica-Bold')
      .fontSize(10)
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
    return;
  }

  // Ensure the destination directory exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Copy the font if it doesn't already exist
  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(sourcePath, destPath);
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
      height: logoHeight - 10,
      align: 'center', // Optional: Add alignment if needed
      valign: 'center', // Optional: Add vertical alignment if needed
    });
  }

  // Draw the title in the center column (column 2), vertically centered
  const titleY = margin + (headerHeight - 16) / 2; // Adjust for font size 16
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(title, margin + columnWidths[0], titleY, {
      width: columnWidths[1],
      align: 'center',
    });

  // Draw the reference, version, and date in individual rows of column 3, centered and bold
  const lastColumnX = margin + columnWidths[0] + columnWidths[1];
  const rowHeight = headerHeight / 3;

  // Reference in the first row
  doc
    .font('Helvetica-Bold')
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
    .font('Helvetica')
    .fontSize(8)
    .text(footerText, margin, footerY, {
      align: 'left',
      width: doc.page.width - 2 * margin, // Make the text full width
    });

  // Pagination text aligned to the right
  const pageText = `Page ${pageNumber} sur ${totalPages}`;
  doc
    .font('Helvetica')
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

      doc.fillColor('black').font('Helvetica-Bold').fontSize(10).text(cell, textX, textY, {
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
    // Ensure fonts are loaded
    ensureFont('Helvetica');
    ensureFont('Helvetica-Bold');
    const tColors: (key: string) => string = await getTranslations('dashboard.colors');
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
    doc.font('Helvetica');

    // Draw the details table
    const detailsData = [
      ['Code du pickup', code],
      ['Date de création du pickup', formatDate(createdAt)],
    ];
    yPosition = drawCenteredTable(doc, detailsData, 150, 'details') + 50;

    // Draw product table header
    drawHeader(
      doc,
      yPosition,
      ['ID', 'Client', 'Tél', 'Gouvérnorat', 'Description', 'COD'],
      [85, 100, 60, 100, 170, 35],
    );
    yPosition += 20;

    // Draw product rows
    for (const subOrder of subOrders) {
      checkAndAddPage(doc);
      drawRow(
        doc,
        yPosition,
        [
          subOrder.deliveryId,
          subOrder.order.firstName + ' ' + subOrder.order.lastName,
          subOrder.order.number,
          subOrder.order.state,
          subOrder.products
            .map(
              (item: any) =>
                `${item.quantity}*${item.product?.name} ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
            )
            .join(' + '),
          subOrder.products.reduce((total: number, item: any) => total + item.quantity * item.detailPrice, 0) + 8,
          ,
        ],

        [85, 100, 60, 100, 170, 35],
        10,
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
      .font('Helvetica')
      .fontSize(10)
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

export const generateLabel = async (subOrder: any): Promise<ActionResponse> => {
  try {
    ensureFont('Helvetica');
    ensureFont('Helvetica-Bold');
    // Initialize PDF document
    const doc = new PDFKit({
      size: 'A4',
      margin: 20,
      bufferPages: true,
    });

    doc.info.Title = 'Label';

    const outputPath = 'label_output.pdf';
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Fetch translations for colors
    const tColors = await getTranslations('dashboard.colors');

    // Define page dimensions
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left;
    let currentY = 20; // Starting Y position

    // === Table Setup ===
    // Define column widths for two-column rows
    const column1Width = pageWidth / 2 - 70; // Adjust as needed
    const column2Width = pageWidth / 2 + 70; // Adjust as needed

    // Helper function to draw table borders (for visual structure)
    const drawTableBorders = (
      doc: PDFKit.PDFDocument,
      x: number,
      y: number,
      width: number,
      height: number,
      columnWidths: number[],
    ) => {
      // Draw outer rectangle (table border)
      doc.rect(x, y, width, height).stroke();

      // Draw vertical lines for columns
      let currentX = x;
      for (let i = 0; i < columnWidths.length; i++) {
        currentX += columnWidths[i];
        doc
          .moveTo(currentX, y)
          .lineTo(currentX, y + height)
          .stroke();
      }

      // Draw horizontal lines (we can define row heights later)
    };

    // Displaying Number of Pieces
    doc
      .font('Helvetica-Bold')
      .fontSize(18)
      .text(`Nombre de pièces: ${subOrder.products.length}`, startX - 10, currentY + 10, {
        align: 'right',
        width: pageWidth,
      });
    // Draw the logo centered vertically in column 1 (smaller size)
    const logoPath = path.resolve('public/img/pdf-logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, startX + 110, currentY + 9, {
        width: 95,
        height: 18,
        // Optional: Add alignment if needed
        valign: 'center', // Optional: Add vertical alignment if needed
      });
    }

    const logoPath2 = path.resolve('public/img/massar.png');
    if (fs.existsSync(logoPath2)) {
      doc.image(logoPath2, startX + 8, currentY + 9, {
        width: 95,
        height: 18,
        // Optional: Add alignment if needed
        valign: 'center', // Optional: Add vertical alignment if needed
      });
    }
    drawTableBorders(doc, startX, currentY, pageWidth, 35, [pageWidth]);

    currentY += 40;

    // Expéditeur and Code à Barre Section
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Expéditeur', startX + 5, currentY, {
        underline: true,
        align: 'left',
        width: column1Width - 10,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Code à Barre:', startX + column1Width + 5, currentY, {
        underline: true,
        align: 'left',
        width: column2Width - 10,
      });

    // Draw borders for this row
    const rowHeight2 = 105; // Adjust based on content
    drawTableBorders(doc, startX, currentY - 5, pageWidth, rowHeight2, [column1Width, column2Width]);

    // Populate Expéditeur Details (Sender)
    let expX = startX + 5;
    let expY = currentY + 20;

    doc.fontSize(10).font('Helvetica-Bold').text('MF:', expX, expY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text('1830786Y/A/M/000', expX + 25, expY);

    expY += 15;

    doc.fontSize(10).font('Helvetica-Bold').text('Nom Commercial:', expX, expY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.seller.storeName ?? 'ECOMNESS'}`, expX + 95, expY);

    expY += 15;

    doc.fontSize(10).font('Helvetica-Bold').text('Tel:', expX, expY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.seller.number}`, expX + 25, expY);

    expY += 15;

    doc.fontSize(10).font('Helvetica-Bold').text('Gouvernorat:', expX, expY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.seller.state}`, expX + 80, expY, {
        width: column1Width - 90,
      });

    expY += 15;
    doc.fontSize(10).font('Helvetica-Bold').text('Adresse:', expX, expY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.seller.address}`, expX + 55, expY, {
        width: column1Width - 90,
      });

    // === Barcode Generation using next-barcode ===
    // Generate barcode (SVG)
    const pngBuffer = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: subOrder.deliveryId, // Barcode text
      scale: 5, // Scale factor
      height: 20, // Height of the barcode
      includetext: true,
      textgaps: 2,
      textyoffset: 2, // Include text below the barcode
    });

    // Convert the SVG to an image (buffer)
    // Convert to PNG buffer
    doc.image(pngBuffer, startX + column1Width + column2Width / 2 - 75, currentY + 20, {
      width: 150,
      height: 70,
      align: 'center',
    });

    // === Third Row: Destinataire and Informations Additionnelles ===
    currentY += rowHeight2;

    // Section Titles (Destinataire, Informations Additionnelles)
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Destinataire', startX + 5, currentY, {
        underline: true,
        align: 'left',
        width: column1Width - 10,
      });

    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Informations Additionnelles', startX + column1Width + 5, currentY, {
        underline: true,
        align: 'left',
        width: column2Width - 10,
      });

    const rowHeight3 = 90;
    drawTableBorders(doc, startX, currentY - 5, pageWidth, rowHeight3, [column1Width, column2Width]);

    // Populate Destinataire Details (Recipient)
    let destX = startX + 5;
    let destY = currentY + 20;

    doc.fontSize(10).font('Helvetica-Bold').fontSize(10).text('Nom:', destX, destY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.fullName}`, destX + 35, destY);

    destY += 15;

    doc.fontSize(10).font('Helvetica-Bold').text('Tel:', destX, destY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.number}`, destX + 25, destY);

    destY += 15;

    doc.fontSize(10).font('Helvetica-Bold').text('Gouvernorat:', destX, destY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.state}`, destX + 80, destY);

    destY += 15;

    doc.fontSize(10).font('Helvetica-Bold').text('Adresse:', destX, destY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${subOrder.order.address}`, destX + 55, destY, {
        width: column1Width,
      });

    // Populate Informations Additionnelles (Additional Info)
    let infoX = startX + column1Width + 5;
    let infoY = currentY + 20;

    doc.fontSize(10).font('Helvetica-Bold').text('Service:', infoX, infoY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`Cash On Delivery`, infoX + 45, infoY);

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Mode de paiement:', infoX, infoY + 15);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`ESPECE`, infoX + 100, infoY + 15);

    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('Remarque:', infoX, infoY + 30);
    let ref1;
    if (subOrder!.order!.subOrders.length > 1) {
      ref1 =
        'Sous commande ' +
        subOrder.code +
        ' ' +
        (subOrder!.order!.subOrders.findIndex((element: any) => element.deliveryId === subOrder.deliveryId) + 1) +
        '/' +
        subOrder!.order!.subOrders.length +
        ' de ' +
        subOrder!.order!.code;
    } else {
      ref1 = 'Commande' + subOrder!.order!.code;
    }
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(ref1, infoX + 60, infoY + 30);

    // === Last Row: Crée-le, Description and Prix Total TTC ===
    currentY += rowHeight3;

    const rowHeight4 = 150;
    drawTableBorders(doc, startX, currentY - 5, pageWidth, rowHeight4, [column1Width, column2Width]);

    let createX = startX + 5;
    let createY = currentY + 5;

    doc.font('Helvetica-Bold').fontSize(10).text('Crée-le :', createX, createY);
    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${formatDate(subOrder.order.createdAt)}`, createX + 50, createY);

    createY += 15;

    doc.font('Helvetica-Bold').text('Description :', createX, createY);

    const description = subOrder.products
      .map(
        (item: any) =>
          ` ${item.quantity}*${item.product?.name} ${item.color ? tColors(item.color) : ''} ${item.size ? item.size : ''}`,
      )
      .join(' + ');

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`${description}`, createX, createY + 15, {
        width: column1Width,
        lineGap: 5,
      });

    let prixX = startX + column1Width + 10;
    let prixY = currentY + 55;

    doc.font('Helvetica-Bold').fontSize(23).text(`Total TTC : ${subOrder.total} DT`, prixX, prixY, { align: 'center' });

    // === Finalize the PDF and Close the Stream ===
    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => {
        const pdfBytes = fs.readFileSync(outputPath);
        resolve({
          success: 'Label généré avec succès',
          data: new Uint8Array(pdfBytes),
        });
      });
      stream.on('error', () =>
        reject({
          error: 'Erreur lors de la génération du label',
        }),
      );
    });
  } catch (error) {
    console.error(error);
    return { error: 'Erreur lors de la génération du label' };
  }
};
