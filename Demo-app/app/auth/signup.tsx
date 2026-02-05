import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { API_BASE_URL  } from  "../../src/config/api";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, gender, dob }),
    });
    const data = await res.json();
    if (data.success) setOtpSent(true);
    else alert(data.message);
  };

  const verifyOtp = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Signup successful");
      router.replace("/auth/login"); // 👈 go to login
    } else {
      alert(data.message);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {!otpSent ? (
        <>
          <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={styles.input} />
          <TextInput placeholder="Gender" value={gender} onChangeText={setGender} style={styles.input} />
          <TextInput placeholder="DOB (YYYY-MM-DD)" value={dob} onChangeText={setDob} style={styles.input} />

          <Pressable style={styles.btn} onPress={sendOtp}>
            <Text style={styles.btnText}>CREATE ACCOUNT</Text>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput placeholder="Enter OTP" value={otp} onChangeText={setOtp} style={styles.input} />
          <Pressable style={styles.btn} onPress={verifyOtp}>
            <Text style={styles.btnText}>VERIFY OTP</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});