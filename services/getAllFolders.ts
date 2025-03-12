import axios from "axios";
import { Folder } from "@/lib/models/folderSchema";
import { connectToDatabase } from "@/lib/mongodb"; // MongoDB bağlantısı

const tenantId = process.env.TENANT_ID!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;
const graphApiUrl = "https://graph.microsoft.com/v1.0";

// 1. Access Token Al
export async function getAccessToken() {
  const response = await axios.post(
    `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    })
  );

  return response.data.access_token;
}

// 2. Tüm Kullanıcıları Listele
export async function getAllUsers() {
  const token = await getAccessToken();
  const response = await axios.get(`${graphApiUrl}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // `mail` alanı null olmayan kullanıcıları filtreliyoruz
  const usersWithEmail = response.data.value.filter(
    (user: any) => user.mail !== null
  );

  console.log("Geçerli Mail Adresi Olan Kullanıcı Listesi", usersWithEmail);
  return usersWithEmail; // Maili olan kullanıcılar
}

// 3. Kullanıcının Tüm Mail Klasörlerini Al
export async function getUserMailFolders(userId: string) {
  try {
    const token = await getAccessToken();
    console.log("data çekiliyor");
    const response = await axios.get(
      `${graphApiUrl}/users/${userId}/mailFolders`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { $top: 200 }, // 200'e kadar klasör çek
      }
    );
    console.log("SONUC", response.data.value);
    return response.data.value; // Klasör listesi
  } catch (error) {
    console.error("Kişinin Posta Kutusu yok:", error);
    return []; // Hata durumunda boş bir dizi döndürülür, işlem devam eder.
  }
}

// 4. Klasörleri MongoDB'ye Kaydet
async function saveFoldersToDB(userId: string, folders: any[]) {
  const { db } = await connectToDatabase(); // MongoDB bağlantısı
  const folderCollection = db.collection("folders"); // Klasör koleksiyonu

  const operations = folders.map((folder) => ({
    updateOne: {
      filter: { folderId: folder.id }, // Güncellenecek belgeyi belirliyoruz
      update: {
        $set: {
          // Veriyi yalnızca $set ile güncelliyoruz
          userId,
          displayName: folder.displayName,
          folderId: folder.id,
          parentFolderId: folder.parentFolderId || null,
          childFolderCount: folder.childFolderCount,
          totalItemCount: folder.totalItemCount,
          unreadItemCount: folder.unreadItemCount,
        },
      },
      upsert: true, // Eğer klasör yoksa yeni bir kayıt oluşturulacak
    },
  }));

  try {
    // Birden fazla klasör işlemi tek seferde yapılır
    await folderCollection.bulkWrite(operations); // bulkWrite kullanarak işlemi gerçekleştiriyoruz
    console.log("Klasörler başarıyla kaydedildi.");
  } catch (error) {
    console.error("Klasörler kaydedilemedi:", error);
  }
}

// 5. Tüm Kullanıcılar için Klasörleri Çek ve Kaydet
export async function backupAllUserFolders() {
  const users = await getAllUsers();

  for (const user of users) {
    console.log(
      `📧 ${user.displayName} kullanıcısının klasörleri çekiliyor...`
    );
    const folders = await getUserMailFolders(user.id);

    console.log("Folderlar", folders);

    await saveFoldersToDB(user.id, folders);
    console.log(`✅ ${user.displayName} klasörleri kaydedildi.`);
  }
}
