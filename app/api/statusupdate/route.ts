// app/api/user/update/route.ts
import { NextResponse } from "next/server";
import updateUserStatus from "@/services/updateUserStatus"; // updateUserStatus fonksiyonunu içeri aktar

export async function POST(req: Request) {
  try {
    const { email, status } = await req.json();

    // Gerekli verilerin olup olmadığını kontrol et
    if (!email || typeof status !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Geçersiz veri!" },
        { status: 400 }
      );
    }

    // Kullanıcı durumunu güncelle
    const result = await updateUserStatus(email, status);

    // Sonuç döndür
    return NextResponse.json(result);
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Bilinmeyen bir hata oluştu" },
      { status: 500 }
    );
  }
}
