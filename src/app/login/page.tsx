"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { message } from "antd";
import {LoadingSpin} from "@/app/components/LoadingSpin";

export default function Home() {
  const router = useRouter(); // Menggunakan router Home.js
  const [messageApi, contextHolder] = message.useMessage();

  const {data: session, status} = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/')
    } else {
      signIn('keycloak',{prompt: 'none'})
    }
  }, [status, router, session]);



  return (
    <>
      {contextHolder}
      <div className="min-h-screen w-full flex justify-center flex-col items-center px-5">
        <LoadingSpin/>
      </div>
    </>
  )
}
