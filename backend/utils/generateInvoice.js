import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

/* ================= BRAND COLORS (FROM YOUR LOGO) ================= */
const COLORS = {
  pink: "#FF2D6F",
  blue: "#00AEEF",
  green: "#7AC943",
  purple: "#8E44AD",
  yellow: "#FFD200",
  dark: "#1F2937",
  gray: "#6B7280",
};

/* ================= CLEAN NUMBER ================= */
const cleanNumber = (value) => {
  if (!value) return 0;
  return (
    Number(
      value
        .toString()
        .replace(/['’"]/g, "")
        .replace(/[^\d.]/g, ""),
    ) || 0
  );
};

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  /* ================= RESPONSE HEADERS ================= */
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${order._id}.pdf`,
  );

  doc.pipe(res);

  /* ================= HEADER BAR ================= */
  doc.rect(0, 0, 612, 120).fill(COLORS.purple);

  /* ================= LOGO ================= */
  const logoPath = path.resolve("backend/assets/kishore_trends1.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 45, 30, { width: 90 });
  }

  /* ================= BRAND TEXT ================= */
  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(24)
    .text("Kishore Trends", 150, 40);

  doc
    .font("Helvetica")
    .fontSize(11)
    .text("Fashion for Every Generation", 150, 72);

  /* ================= SAFE DATE ================= */
  const invoiceDate = order.createdAt || order.date || Date.now();

  /* ================= INVOICE META ================= */
  doc
    .fillColor(COLORS.dark)
    .fontSize(10)
    .text(`Invoice ID: ${order._id}`, 50, 140)
    .text(`Date: ${new Date(invoiceDate).toDateString()}`, 50, 155);

  /* ================= BILL TO ================= */
  doc
    .fontSize(13)
    .font("Helvetica-Bold")
    .fillColor(COLORS.purple)
    .text("Billed To", 50, 185);

  doc
    .fontSize(10)
    .font("Helvetica")
    .fillColor(COLORS.gray)
    .text(order.address?.email || "-", 50, 205)
    .text(order.address?.phone || "-", 50, 220)
    .text(order.address?.street || "-", 50, 235);

  /* ================= TABLE HEADER ================= */
  const tableTop = 280;

  doc
    .fillColor(COLORS.dark)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("Product", 50, tableTop)
    .text("Qty", 310, tableTop)
    .text("Price", 380, tableTop)
    .text("Total", 470, tableTop);

  doc
    .moveTo(50, tableTop + 16)
    .lineTo(560, tableTop + 16)
    .strokeColor(COLORS.blue)
    .lineWidth(2)
    .stroke();

  /* ================= TABLE BODY ================= */
  let y = tableTop + 32;
  let grandTotal = 0;

  order.items.forEach((item) => {
    const price = cleanNumber(item.price);
    const qty = cleanNumber(item.quantity);
    const total = price * qty;

    grandTotal += total;

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor(COLORS.dark)
      .text(item.name, 50, y, { width: 240 })
      .text(qty.toString(), 310, y)
      .text(`₹${price}`, 380, y)
      .text(`₹${total}`, 470, y);

    y += 22;
  });

  /* ================= GRAND TOTAL ================= */
  doc.rect(350, y + 15, 210, 40).fill(COLORS.green);

  doc
    .fillColor("#25343F")
    .fontSize(13)
    .font("Helvetica-Bold")
    .text("Grand Total", 365, y + 28)
    .text(`₹${grandTotal}`, 470, y + 28);

  /* ================= FOOTER ================= */
  doc
    .fillColor(COLORS.gray)
    .fontSize(9)
    .font("Helvetica")
    .text("Thank you for shopping with Kishore Trends 💖", 50, 760, {
      align: "center",
    });

  doc.end();
};

export default generateInvoice;
