import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOption";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { token } = req.nextauth;
    if (!token || !token.user) {
      return NextResponse.rewrite(new URL('/block', req.url))
    }
      const hasRole = token.user.roles

      const hasPalletControlRoleOperator = token.user.roles.some(role => role === 'operator');
    if (hasPalletControlRoleOperator|| !hasRole) {
      return NextResponse.rewrite(new URL('/block', req.url))
    }

  },
  {
    cookies: authOptions.cookies ,
    pages: authOptions.pages
  }
);
export const config = { matcher: ["/", "/((?!register|api|login|$).*)"]}