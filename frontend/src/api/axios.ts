import axios from "axios";

export const api = axios.create({
	baseURL: process.env.BUN_PUBLIC_BASE_URL,
	withCredentials: true,
})
