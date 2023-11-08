"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import axios from "@/lib/axios";
import { redirect, useRouter } from "next/navigation";

export const useRefreshToken = () => {
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated:async () => {
      await signIn('keycloak')
    },
  });
  const router = useRouter()

  return async () => {
   try {
     const res = await axios.get("http://localhost:3200/v1/auth/refresh", {
         headers: {
           // 'Authorization': 'Bearer ' + session?.user?.refreshToken
         }
       }
     );

     if (session) {
       return await update({
         accessToken: res.data.accessToken
       })
     } else {
       signOut({
         redirect: true
       })
     }
   } catch (e : any) {
     if (e.response.status === 401) {
       await signOut(
         {
           redirect: true
         }
       )
       router.replace('http://localhost:3001/')
       redirect('http://localhost:3001/')
     }
     await signOut(
       {
         redirect: true
       }
     )
   }
  }
};