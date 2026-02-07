import { API_BASE_URL } from "../config/api";

/* ========== SIGNUP ========== */
export const signupSendOtp = async (data: {
  name: string;
  phone: string;
  gender: string;
  dob: string;
}) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const signupVerifyOtp = async (phone: string, otp: string) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/register/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });
  return res.json(); // ⚠️ no token stored here
};

/* ========== LOGIN ========== */
export const loginSendOtp = async (phone: string) => {
  const res = await fetch(`${API_BASE_URL}/api/auth/login/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return res.json();
};

const loginVerifyOtp = async (phone: string, otp: string) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone, otp }),
    });
    return await res.json();
};