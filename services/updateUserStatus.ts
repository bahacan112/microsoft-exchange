import { User } from "@/lib/models/userSchema"; // User modelini import et
import { connectToDatabase } from "@/lib/mongodb"; // Veritabanı bağlantısını içeren dosyayı import et

const updateUserStatus = async (email: string, status: boolean) => {
  try {
    console.log("bağlantı sağlanıyor");
    // Veritabanı bağlantısını sağla
    const { db } = await connectToDatabase(); // Bağlantıyı aç

    // Veritabanında belirtilen e-posta adresine sahip kullanıcıyı bul
    const user = await db.collection("users").findOne({ mail: email });

    if (!user) {
      throw new Error("Kullanıcı bulunamadı!");
    }

    // Kullanıcının status bilgisini güncelle
    user.status = status;

    // Güncellenen kullanıcıyı veritabanına kaydet
    await db
      .collection("users")
      .updateOne({ mail: email }, { $set: { status: user.status } });

    return {
      success: true,
      message: "Kullanıcı durumu başarıyla güncellendi.",
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { success: false, message: error.message };
    } else {
      return { success: false, message: "An unknown error occurred" };
    }
  }
};

export default updateUserStatus;
