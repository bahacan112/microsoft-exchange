import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // MongoDB bağlantı fonksiyonu

export async function GET(req: NextRequest) {
  try {
    // URL'den userId'yi al
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId"); // Kullanıcı ID'sini al

    if (!userId) {
      return NextResponse.json(
        { message: "userId parametresi eksik" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase(); // MongoDB bağlantısı

    // Veritabanından kullanıcıya ait klasörleri çek
    const folders = await db.collection("folders").find({ userId }).toArray(); // Klasörleri filtrele

    return NextResponse.json(folders); // Verileri frontend'e gönder
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Veri çekme hatası", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Veri çekme hatası", error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}
