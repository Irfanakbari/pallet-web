import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    
    // this will log out the user on Keycloak side
    const url = `${process.env.KEYCLOACK_END_URL}?client_id=pallet-control&post_logout_redirect_uri=${encodeURIComponent(process.env.NEXTAUTH_URL!)}`;

    try {
      await fetch(url, { method: "GET" });
    } catch (err) {
      return Response.json({ status: 500 })    }
  }
  return Response.json({ status: 500 })
}