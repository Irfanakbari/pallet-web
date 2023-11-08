"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Session } from "next-auth";

export default function AuthProvider({ children, session }: {
  children: React.ReactNode,
  session: Session | null
}) {
  return (
    // <Provider store={store}>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    // </Provider>
  )
}