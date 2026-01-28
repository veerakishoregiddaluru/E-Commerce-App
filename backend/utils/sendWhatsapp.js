import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

/* =========================
   ORDER SUCCESS MESSAGE
========================= */
const sendOrderSuccessWhatsApp = async ({
  userPhone,
  userName,
  orderId,
  amount,
  paymentMethod,
}) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${userPhone}`,
      body: `✅ Order Confirmed!

Hi ${userName} 👋
Your order *${orderId.toString().slice(-6)}* has been placed successfully 🎉

💳 Payment: ${paymentMethod}
💰 Amount: ₹${amount}

Thank you for shopping with Kishore Trends ❤️`,
    });

    console.log("✅ WhatsApp order success sent");
  } catch (error) {
    console.error("❌ WhatsApp order success error:", error.message);
  }
};

/* =========================
   ORDER STATUS UPDATE MESSAGE
========================= */
const sendOrderStatusWhatsApp = async ({ phone, name, orderId, status }) => {
  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${phone}`,
      body: `📦 Order Update!

Hi ${name} 👋
Your order *${orderId.toString().slice(-6)}* status has been updated.

🚚 Status: *${status}*

Thank you for shopping with Kishore Trends ❤️`,
    });

    console.log("✅ WhatsApp order status sent");
  } catch (error) {
    console.error("❌ WhatsApp order status error:", error.message);
    throw error;
  }
};

export { sendOrderSuccessWhatsApp, sendOrderStatusWhatsApp };
