import Email from "@/lib/models/emailSchema";

interface EmailData {
  subject: string;
  sender: { emailAddress: { address: string } };
  from: { emailAddress: { address: string } };
  toRecipients: { emailAddress: { name: string; address: string } }[];
  ccRecipients: { emailAddress: { name: string; address: string } }[];
  bccRecipients: { emailAddress: { name: string; address: string } }[];
  body: { contentType: string; content: string };
  receivedDateTime: string;
  sentDateTime: string;
  hasAttachments: boolean;
  internetMessageId: string;
  changeKey: string;
  conversationId: string;
  webLink: string;
  inferenceClassification: string;
  attachments: { name: string; contentBytes: string; contentType: string }[];
}

const saveEmailsToDatabase = async (emails: EmailData[]) => {
  try {
    for (const emailData of emails) {
      const email = new Email({
        subject: emailData.subject,
        sender: emailData.sender.emailAddress.address,
        from: emailData.from.emailAddress.address,
        toRecipients: emailData.toRecipients.map((recipient) => ({
          name: recipient.emailAddress.name,
          address: recipient.emailAddress.address,
        })),
        ccRecipients: emailData.ccRecipients.map((recipient) => ({
          name: recipient.emailAddress.name,
          address: recipient.emailAddress.address,
        })),
        bccRecipients: emailData.bccRecipients.map((recipient) => ({
          name: recipient.emailAddress.name,
          address: recipient.emailAddress.address,
        })),
        body: {
          contentType: emailData.body.contentType,
          content: emailData.body.content,
        },
        receivedDateTime: new Date(emailData.receivedDateTime),
        sentDateTime: new Date(emailData.sentDateTime),
        hasAttachments: emailData.hasAttachments,
        internetMessageId: emailData.internetMessageId,
        changeKey: emailData.changeKey,
        conversationId: emailData.conversationId,
        webLink: emailData.webLink,
        inferenceClassification: emailData.inferenceClassification,
        attachments: emailData.hasAttachments
          ? emailData.attachments.map((att) => ({
              name: att.name,
              contentBytes: att.contentBytes,
              contentType: att.contentType,
            }))
          : [],
      });

      await email.save(); // Veriyi kaydediyoruz
      console.log(`E-posta başarıyla kaydedildi: ${emailData.subject}`);
    }
  } catch (error) {
    console.error("Veritabanına kaydedilirken hata oluştu:", error);
  }
};

export default saveEmailsToDatabase;
