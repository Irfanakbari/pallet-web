import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Master - Part',
  description: 'Generated by create next app',
}

export default function RootLayout({
                                           children,
                                         }: {
  children: React.ReactNode
}) {

  return (
      children
  )
}
