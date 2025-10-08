import mg from "../../config/mailgun.js";

const sendMail = async (to, subject, text, html = null) => {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `<donotreply@${process.env.MAILGUN_DOMAIN}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Mail sent:", response.id);
    return { success: true, message: "Mail sent successfully", response };
  } catch (error) {
    console.error("Mailgun error in send.js function :", error);
    return { success: false, message: error.message };
  }
};

export { sendMail };