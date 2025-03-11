import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import { getActiveUsers } from "../../../services/getActiveUsers"; // getActiveUsers servisini import et

// GET isteği ile MongoDB'deki tüm verileri alacağız
export async function GET() {
  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection("users"); // 'users' koleksiyonundan verileri alıyoruz

    // MongoDB'den tüm kullanıcıları alalım
    const users = await collection.find({}).toArray();

    return NextResponse.json({
      message: "Users retrieved successfully",
      data: users,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}

// POST isteği ile Microsoft'tan alınan verileri MongoDB'ye ekleyeceğiz
export async function POST(req: NextRequest) {
  try {
    const { client, db } = await connectToDatabase();
    const collection = db.collection("users"); // 'users' koleksiyonuna veri ekliyoruz

    // Microsoft'tan aktif kullanıcıları alalım
    const activeUsers = await getActiveUsers(); // getActiveUsers servisinden aktif kullanıcı verilerini alıyoruz

    console.log("Active Users from Microsoft:", activeUsers); // Kullanıcıları kontrol et

    if (activeUsers && Array.isArray(activeUsers)) {
      // MongoDB'den mevcut kullanıcıları alalım
      const existingUsers = await collection.find({}).toArray();
      const existingUserEmails = existingUsers.map((user: any) => user.mail);

      // Güncellenmiş kullanıcılar için bir array oluşturuyoruz
      const usersToUpdateOrInsert = activeUsers.map((user: any) => ({
        ...user,
        role: "Yeni", // role olarak 'Yeni' ekliyoruz
        status: false, // status olarak 'false' ekliyoruz
        lastupdate: new Date().toISOString(),
      }));

      // Veritabanındaki mevcut kullanıcıları güncelleme işlemi
      for (const user of usersToUpdateOrInsert) {
        // Eğer mail mevcutsa, kullanıcıyı güncelle
        if (existingUserEmails.includes(user.mail)) {
          await collection.updateOne(
            { mail: user.mail }, // Mail adresine göre güncelleme yapıyoruz
            {
              $set: {
                role: user.role,
                status: user.status,
                lastupdate: user.lastupdate,
              },
            } // Yalnızca role ve status güncelleniyor
          );
        } else {
          // Eğer mail mevcut değilse, yeni kullanıcıyı ekle
          await collection.insertOne(user);
        }
      }

      return NextResponse.json(
        {
          message: "Users updated and added successfully",
          data: usersToUpdateOrInsert, // Eklenen ve güncellenmiş kullanıcıları döndürüyoruz
        },
        { status: 201 }
      );
    } else {
      console.error("No valid users returned from Microsoft.");
      return NextResponse.json(
        { message: "No valid users returned from Microsoft" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal Server Error", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
