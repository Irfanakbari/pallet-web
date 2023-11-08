"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { message } from "antd";

export default function Home() {
  const router = useRouter(); // Menggunakan router Home.js
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();

  const {data: session, status} = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/')
    }
  }, [status, router, session]);



  return (
    <>
      {contextHolder}
      <div className="min-h-screen w-full flex justify-center flex-col items-center px-5">
        <div className={`w-1/3 flex flex-col gap-5`}>
          <button
            onClick={()=>signIn('keycloak')}
            type="submit"
            disabled={loading}
            className={
              `w-full flex justify-center items-center h-14 bg-green-400 hover:bg-green-600 py-3 text-white text-center text-xl mt-7 rounded ${loading ? `bg-green-600` : `bg-green-400`}`
            }>
            {
              !loading && 'Login'
            }
            {/*<PropagateLoader loading={loading} color="white" size={8} />*/}
          </button>
          {/* Informasi hak cipta dan versi aplikasi */}
          <p className="text-black text-center text-xs mt-8">
            PT VUTEQ INDONESIA © 2023  {session?.user?.name}
          </p>
          {/*<p className="text-white mt-2">*/}
          {/*  Vuteq Indonesia Integrated System*/}
          {/*</p>*/}
        </div>
      </div>
    </>
  )
}
