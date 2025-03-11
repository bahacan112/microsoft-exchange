import mongoose from "mongoose";

// E-posta ekleri için şema
const attachmentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  contentBytes: { type: String, required: true },
  contentType: { type: String, required: true },
});

// Ana E-posta şeması
const emailSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    bodyPreview: { type: String, required: true },
    receivedDateTime: { type: Date, required: true },
    sentDateTime: { type: Date, required: true },
    importance: { type: String, required: true },
    isRead: { type: Boolean, required: true },
    hasAttachments: { type: Boolean, required: true },
    internetMessageId: { type: String, required: true },
    conversationId: { type: String, required: true },
    conversationIndex: { type: String, required: true },
    body: {
      contentType: { type: String, required: true },
      content: { type: String, required: true },
    },
    sender: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
    toRecipients: [
      {
        name: { type: String, required: true },
        address: { type: String, required: true },
      },
    ],
    ccRecipients: [
      {
        name: { type: String },
        address: { type: String },
      },
    ],
    bccRecipients: [
      {
        name: { type: String },
        address: { type: String },
      },
    ],
    attachments: [attachmentSchema], // E-posta eklerini saklamak için
    webLink: { type: String },
    flag: {
      flagStatus: { type: String, required: true },
    },
    parentFolderId: { type: String },
    changeKey: { type: String, required: true },
    inferenceClassification: { type: String },
  },
  { timestamps: true }
);

const Email = mongoose.model("Email", emailSchema);

export default Email;
