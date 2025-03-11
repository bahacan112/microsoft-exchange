// app/api/users/route.ts
import { NextResponse } from "next/server";
import { getActiveUsers, User } from "../../../services/getActiveUsers"; // Import the User type

export async function GET(): Promise<
  NextResponse<User[]> | NextResponse<{ error: any }>
> {
  // Use User type
  try {
    const users = await getActiveUsers();
    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
