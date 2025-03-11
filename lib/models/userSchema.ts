import mongoose, { Schema, Document } from "mongoose";

// Folder Schema: Klasör yapısını tutmak için
const folderSchema = new Schema({
  folderId: {
    type: String,
    required: true,
    unique: true,
  },
  folderName: {
    type: String,
    required: true,
  },
  subFolders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Folder", // Alt klasörleri yine Folder olarak referans alıyoruz
    },
  ],
});

// User Schema: Kullanıcı bilgilerini tutmak için
const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["Yeni", "Acenta", "Admin", "Operatör", "Rehber"], // Örneğin rol seçenekleri
    default: "Yeni",
  },
  status: {
    type: Boolean,
    default: true, // Kullanıcı aktif mi
  },
  lastupdate: {
    type: Date,
    default: Date.now,
  },
  folders: [folderSchema], // Kullanıcının sahip olduğu klasörler
});

const User = mongoose.model("User", userSchema);

export { User, userSchema };
