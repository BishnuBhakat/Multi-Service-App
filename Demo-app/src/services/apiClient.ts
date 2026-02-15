// import { API_BASE_URL } from "../../src/config/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const apiFetch = async (
//   endpoint: string,
//   options: RequestInit = {}
// ) => {
//   const token = await AsyncStorage.getItem("token");

//   console.log("API TOKEN:", token); // 🔍 DEBUG

//   const headers = {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     ...options.headers,
//   };

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   return res.json();
// };
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

// export const apiFetch = async (endpoint: string, options: any = {}) => {
//   const token = await AsyncStorage.getItem("token");

//   const res = await fetch(`${API_BASE_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers || {}),
//     },
//   });

//   return res.json();
// };
export const apiFetch = async (endpoint: string, options: any = {}) => {
  const token = await AsyncStorage.getItem("token");

console.log("API CALL:", endpoint);
console.log("USING TOKEN:", token);

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // read raw response first
  const text = await res.text();

  // try to convert to JSON safely
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("====== BACKEND RETURNED NON‑JSON ======");
    console.log(text); // shows actual server error
    console.log("=======================================");
    throw new Error("Server returned invalid response");
  }
};
