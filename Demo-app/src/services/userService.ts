import { apiFetch } from "./apiClient";

/* ================= SEND OTP ================= */
export const sendProfileOtp = async () => {
  return apiFetch("/api/user/send-update-otp", {
    method: "POST",
  });
};

/* ================= VERIFY OTP + UPDATE PROFILE ================= */
export const verifyProfileOtp = async (data: {
  otp: string;
  name: string;
  email: string;
  gender: string;
  dob: string;
}) => {
  return apiFetch("/api/user/verify-update-otp", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

