import { API_BASE_URL } from "../../src/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = await AsyncStorage.getItem("token");

  console.log("API TOKEN:", token); // 🔍 DEBUG

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return res.json();
};