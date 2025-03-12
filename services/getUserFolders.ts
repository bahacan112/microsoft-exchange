import axios from "axios";
import { getAccessToken } from "../utils/auth";

export const getUserFolders = async (userId: string) => {
  const token = await getAccessToken(); // Access token'ı al
  const response = await axios.get(
    `https://graph.microsoft.com/users/${userId}/mailFolders`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { $top: 200 },
    }
  );

  // Klasörlerin ve içindeki e-posta sayılarının listesi
  const foldersWithMailCount = response.data.value.map((folder: any) => ({
    id: folder.id,
    displayName: folder.displayName,
    mailCount: folder.childFolderCount, // Alt klasör sayısı veya diğer uygun veri
  }));

  return foldersWithMailCount;
};
