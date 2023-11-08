import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const BASE_URL_AUTH = process.env.NEXT_PUBLIC_BASE_URL;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const axiosInst = axios.create({
  baseURL: BASE_URL_AUTH,
  headers: { "Content-Type": "application/json" },
});
export const axiosAuth = setupCache(axiosInst)
