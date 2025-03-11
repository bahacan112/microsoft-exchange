// utils/auth.ts
import axios from "axios";
import { config } from "dotenv";

config();

const tenantId = process.env.TENANT_ID!;
const clientId = process.env.CLIENT_ID!;
const clientSecret = process.env.CLIENT_SECRET!;

export async function getAccessToken(): Promise<string> {
  console.log("access token alınıyor...");
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    })
  );
  console.log(response.data.access_token);
  return response.data.access_token;
}
