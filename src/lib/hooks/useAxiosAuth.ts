"use client";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRefreshToken } from "@/lib/hooks/useRefreshToken";
import { axiosAuth } from "@/lib/axios";

const useAxiosAuth = () => {
  const { data: session, update } = useSession({
    required: true
  });
  const refreshToken = useRefreshToken();

  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {

        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${session?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 || error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const res = await update()
          if(res?.error) return signOut({redirect:true})
          prevRequest.headers["Authorization"] = `Bearer ${res?.accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [session, refreshToken]);

  return axiosAuth;
};

export default useAxiosAuth;