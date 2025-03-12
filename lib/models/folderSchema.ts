import mongoose, { Schema, model, models } from "mongoose";

const folderSchema = new Schema({
  userId: { type: String, required: true }, // Kullanıcı e-posta adresi
  displayName: { type: String, required: true }, // Klasör adı
  folderId: { type: String, required: true, unique: true }, // Exchange'deki klasör ID'si
  parentFolderId: { type: String, default: null }, // Üst klasör ID'si
  childFolderCount: { type: Number, default: 0 }, // Alt klasör sayısı
  totalItemCount: { type: Number, default: 0 }, // Klasördeki toplam öğe sayısı
  unreadItemCount: { type: Number, default: 0 }, // Okunmamış öğe sayısı
  sizeInBytes: { type: Number, default: 0 }, // Klasör boyutu (Byte cinsinden)
  isHidden: { type: Boolean, default: false }, // Klasör gizli mi?
});

export const Folder = models.Folder || model("Folder", folderSchema);
