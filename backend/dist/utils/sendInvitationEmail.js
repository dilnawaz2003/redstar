import nodemailer from "nodemailer";
export const sendInvitationEmail = async ({ to, inviterName, workspaceName, inviteLink, }) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        from: `"${workspaceName}" <${process.env.SMTP_FROM}>`,
        to,
        subject: `You're invited to join ${workspaceName}`,
        html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>You're invited!</h2>
        <p>
          <strong>${inviterName}</strong> has invited you to join
          <strong>${workspaceName}</strong>.
        </p>

        <p>Click the button below to accept the invitation:</p>

        <a
          href="${inviteLink}"
          style="
            display: inline-block;
            padding: 10px 16px;
            background-color: #dc2626;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 12px;
          "
        >
          Accept Invitation
        </a>

        <p style="margin-top: 20px; color: #555;">
          If you didn’t expect this invitation, you can safely ignore this email.
        </p>
      </div>
    `,
    };
    await transporter.sendMail(mailOptions);
};
//# sourceMappingURL=sendInvitationEmail.js.map