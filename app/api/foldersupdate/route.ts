import { NextResponse } from "next/server";
import { backupAllUserFolders } from "@/services/getAllFolders";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    await backupAllUserFolders();
    return NextResponse.json({
      success: true,
      message: "Tüm kullanıcı klasörleri yedeklendi.",
    });
  } catch (error) {
    console.error("Yedekleme hatası:", error);
    return NextResponse.json(
      { success: false, message: "Klasörler yedeklenemedi." },
      { status: 500 }
    );
  }
}
