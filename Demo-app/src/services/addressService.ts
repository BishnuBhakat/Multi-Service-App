import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

/* ================= AUTH HEADER ================= */
const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw new Error("No auth token found");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/* ================= GET ADDRESSES ================= */
export const getAddresses = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/address`, {
      method: "GET",
      headers: await getAuthHeader(),
    });

    return await res.json();
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);
    return { success: false, message: "Failed to fetch addresses" };
  }
};

/* ================= ADD ADDRESS ================= */
export const addAddress = async (data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/address`, {
      method: "POST",
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    return { success: false, message: "Failed to add address" };
  }
};

/* ================= UPDATE ADDRESS ================= */
export const updateAddress = async (id: string, data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/address/${id}`, {
      method: "PUT",
      headers: await getAuthHeader(),
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    return { success: false, message: "Failed to update address" };
  }
};

/* ================= DELETE ADDRESS ================= */
export const deleteAddress = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/address/${id}`, {
      method: "DELETE",
      headers: await getAuthHeader(),
    });

    return await res.json();
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    return { success: false, message: "Failed to delete address" };
  }
};
