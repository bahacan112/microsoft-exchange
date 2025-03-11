// services/microsoftService.ts
import axios from "axios";
import { getAccessToken } from "../utils/auth";

export interface User {
  id: string;
  displayName: string;
  mail: string;
}

export async function getActiveUsers(): Promise<User[]> {
  const accessToken = await getAccessToken();

  const response = await axios.get("https://graph.microsoft.com/v1.0/users", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  // Yalnızca id, displayName ve mail alanlarını döndürmek için map kullanıyoruz
  const users = response.data.value
    .filter((user: any) => user.mail) // mail alanı boş olmayan kullanıcıları filtreler
    .map((user: any) => ({
      id: user.id,
      displayName: user.displayName,
      mail: user.mail,
    }));

  return users;
}
