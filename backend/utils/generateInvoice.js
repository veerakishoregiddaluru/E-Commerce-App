import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

/* ================= COLORS ================= */
const COLORS = {
  purple: "#6E026F",
  accent: "#161E54",
  dark: "#1F2937",
  gray: "#6B7280",
  light: "#F5F5F7",
};

const cleanNumber = (value) => {
  if (!value) return 0;
  return Number(value.toString().replace(/[^\d.]/g, "")) || 0;
};

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ size: "A4", margin: 0 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename=invoice-${order._id}.pdf`,
  );

  doc.pipe(res);

  /* ================= BACKGROUND ================= */
  doc.rect(0, 0, 612, 792).fill("white");

  /* ================= HEADER ================= */
  doc.rect(0, 0, 612, 150).fill(COLORS.purple);

  // logo image
  const logoPath = path.resolve("backend/assets/kishore_trends1.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 70 });
  }

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text("KISHORE TRENDS", 140, 45);

  doc
    .font("Helvetica")
    .fontSize(12)
    .text("Fashion for Every Generation", 140, 78);

  doc.fontSize(18).font("Helvetica-Bold").text("INVOICE", 450, 60);

  /* ================= WHITE CARD ================= */
  doc.roundedRect(40, 170, 532, 560, 12).fill(COLORS.light);

  /* ================= BILLING ================= */
  const invoiceDate = order.createdAt || Date.now();

  doc
    .fillColor(COLORS.dark)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Billing To:", 60, 200);

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(COLORS.gray)
    .text(order.address?.email || "-", 60, 220)
    .text(order.address?.phone || "-", 60, 235)
    .text(order.address?.street || "-", 60, 250);

  doc
    .fillColor(COLORS.dark)
    .fontSize(10)
    .text(`Invoice ID: ${order._id}`, 380, 220)
    .text(`Date: ${new Date(invoiceDate).toDateString()}`, 380, 235);

  /* ================= TABLE HEADER ================= */
  const tableTop = 300;

  doc.roundedRect(60, tableTop, 492, 30, 8).fill(COLORS.dark);

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("Product", 70, tableTop + 8)
    .text("Qty", 310, tableTop + 8)
    .text("Price", 370, tableTop + 8)
    .text("Total", 460, tableTop + 8);

  /* ================= TABLE BODY ================= */
  let y = tableTop + 45;
  let grandTotal = 0;

  order.items.forEach((item) => {
    const price = cleanNumber(item.price);
    const qty = cleanNumber(item.quantity);
    const total = price * qty;
    grandTotal += total;

    doc
      .fillColor(COLORS.dark)
      .font("Helvetica")
      .fontSize(10)
      .text(item.name, 70, y, { width: 200 })
      .text(qty.toString(), 310, y)
      .text(`₹${price}`, 370, y)
      .text(`₹${total}`, 460, y);

    y += 24;
  });

  /* ================= TOTAL BOX ================= */
  doc.roundedRect(350, y + 20, 200, 45, 8).fill(COLORS.accent);

  doc
    .fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(13)
    .text("Grand Total", 365, y + 35)
    .text(`₹${grandTotal}`, 460, y + 35);

  /* ================= FOOTER ================= */
  doc
    .fillColor(COLORS.gray)
    .fontSize(9)
    .text("Thank you for shopping with Kishore Trends 💖", 60, 710, {
      align: "center",
      width: 492,
    });

  doc.end();
};

export default generateInvoice;
