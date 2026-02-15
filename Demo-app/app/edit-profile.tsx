// import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import OtpModal from "@/src/components/OtpModal";
import { sendProfileOtp, verifyProfileOtp } from "@/src/services/userService";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";



export default function EditProfile() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    dob?: string;
  }>();

  /* ================= STATES ================= */

  const [name, setName] = useState(params.name ?? "");
  const [email, setEmail] = useState(params.email ?? "");
  const [phone] = useState(params.phone ?? ""); // read‑only
  // const [gender, setGender] = useState(params.gender ?? ""); ----> eta
  // const [dob, setDob] = useState<Date | null>(
  //   params.dob ? new Date(params.dob) : null
  // );
//   const parseDob = (value?: string) => {.  -------
//   if (!value) return null;
//   const [d, m, y] = value.split("/");
//   return new Date(Number(y), Number(m) - 1, Number(d)); --------
// };

  // const [dob, setDob] = useState<Date | null>(parseDob(params.dob));  --------> ei duto o
  // const [dobText, setDobText] = useState(params.dob ?? "");

  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [dobText, setDobText] = useState("");

  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showOtp, setShowOtp] = useState(false);


  useEffect(() => {
  if (params.gender) {
    setGender(String(params.gender));
  }

  if (params.dob) {
    const date = new Date(String(params.dob));

    if (!isNaN(date.getTime())) {
      setDob(date);

      const d = String(date.getDate()).padStart(2, "0");
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = date.getFullYear();

      setDobText(`${d}/${m}/${y}`);
    }
  }
}, [params.gender, params.dob]);


  /* ================= DATE LIMITS ================= */
  const today = new Date();

  // minimum age 13
  const maxDOB = new Date(
    today.getFullYear() - 13,
    today.getMonth(),
    today.getDate()
  );

  // maximum age 120
  const minDOB = new Date(
    today.getFullYear() - 120,
    today.getMonth(),
    today.getDate()
  );
  /* ================= DATE FORMAT ================= */

  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const onDateChange = (_: any, selected?: Date) => {
    setShowDobPicker(false);
    if (!selected) return;
    setDob(selected);
    setDobText(formatDate(selected));
  };
    /* ================= VALIDATION ================= */
  const validateDOB = (date: Date) => {
    if (date > maxDOB) return "You must be at least 13 years old";
    if (date < minDOB) return "Invalid date of birth";
    return null;
  };


  /* ================= SAVE CLICK ================= */
const [otpRequested, setOtpRequested] = useState(false);

const onSave = async () => {
if (otpRequested) return; // 🚨 BLOCK duplicate calls

if (!name.trim()) return Alert.alert("Name required");
if (!email.trim()) return Alert.alert("Email required");
if (!gender) return Alert.alert("Select gender");
if (!dob) return Alert.alert("Select date of birth");

try {
setOtpRequested(true);

const res = await sendProfileOtp();

if (!res?.success) {
setOtpRequested(false);
Alert.alert("Error", "Failed to send OTP");
return;
}

setShowOtp(true);

} catch {
setOtpRequested(false);
Alert.alert("Network error");
}
};


  /* ================= OTP VERIFY ================= */

  const onOtpVerify = async (otp: string) => {
try {

const res = await verifyProfileOtp({
  otp,
  name,
  email,
  gender,
  dob: formatDate(dob!)
});

if (!res?.success) {
  setOtpRequested(false);
  Alert.alert("Invalid OTP");
  return;
}

setShowOtp(false);
setOtpRequested(false);
// Alert.alert("Success", "Profile updated successfully"); ----_ edit here

// router.replace("/account");

const token = await AsyncStorage.getItem("token");

console.log("====== PROFILE UPDATE TOKEN ======");
console.log(token);
console.log("=================================");

Alert.alert("Success", "Profile updated successfully");
router.replace("/account");


} catch {
Alert.alert("Server error");
}
};


  /* ================= UI ================= */

  return (
    <View style={styles.container}>

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.card}>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Enter your name"
        />

        <Text style={styles.label}>Email *</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          value={phone}
          editable={false}
          style={styles.inputDisabled}
        />

        {/* GENDER */}
        <Text style={styles.label}>Gender *</Text>
        <Pressable style={styles.input} onPress={() => setShowGenderPicker(true)}>
          <Text style={{ color: gender ? "#111" : "#9ca3af" }}>
            {gender || "Select Gender"}
          </Text>
        </Pressable>

        <Modal transparent visible={showGenderPicker} animationType="slide">
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowGenderPicker(false)}
          >
            <View style={styles.modalBox}>
              <Pressable
                style={styles.option}
                onPress={() => {
                  setGender("Male");
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.optionText}>Male</Text>
              </Pressable>

              <Pressable
                style={styles.option}
                onPress={() => {
                  setGender("Female");
                  setShowGenderPicker(false);
                }}
              >
                <Text style={styles.optionText}>Female</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>

        {/* DOB */}
        <Text style={styles.label}>Date of Birth *</Text>
        <Pressable style={styles.input} onPress={() => setShowDobPicker(true)}>
          {/* <Text style={{ color: dob ? "#111" : "#9ca3af" }}> */}
          <Text style={{ color: dob ? "#111827" : "#6b7280" }}>
            {dobText || "Select Date of Birth"}
          </Text>
        </Pressable>

          {showDobPicker && (
              <Modal transparent animationType="slide">
                  <View style={styles.modalOverlay}>
                      <View style={styles.pickerContainer}>

                                                  <Pressable
                                                      style={styles.doneBtn}
                                                      onPress={() => setShowDobPicker(false)}
                                                  >
                                                      <Text style={styles.doneText}>Done</Text>
                                                  </Pressable>

                          <DateTimePicker
                              value={dob || maxDOB}
                              mode="date"
                              display="spinner"
                              maximumDate={maxDOB}
                              minimumDate={minDOB}
                              onChange={onDateChange}
                              themeVariant="light"
                          />

                      </View>
                  </View>
              </Modal>
          )}


        {/* Save Changes */}
        <Pressable
          style={[styles.saveBtn, otpRequested && { opacity: 0.6 }]}
          onPress={onSave}
          disabled={otpRequested}
        >
          <Text style={styles.saveText}>
            {otpRequested ? "Sending OTP..." : "Save Changes"}
          </Text>
        </Pressable>


      </View>

      <OtpModal
        visible={showOtp}
        onVerify={onOtpVerify}
        onClose={() => {
          setShowOtp(false);
          setOtpRequested(false);
        }}
      />

    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9", padding: 14 },
  topBar: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  back: { fontSize: 24, fontWeight: "900" },
  title: { fontSize: 20, fontWeight: "900" },
  card: { backgroundColor: "#fff", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  label: { fontWeight: "800", color: "#374151", marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: "#d1d5db", borderRadius: 12, padding: 14, backgroundColor: "#fff" },
  inputDisabled: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 12, padding: 14, backgroundColor: "#f3f4f6", color: "#6b7280" },
  saveBtn: { marginTop: 22, backgroundColor: "#2563eb", padding: 14, borderRadius: 14, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.35)" },
  modalBox: { backgroundColor: "#fff", borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16 },
  option: { paddingVertical: 16 },
  optionText: { fontSize: 17, fontWeight: "700" },
  pickerContainer: {
  backgroundColor: "#ffffff",
  paddingBottom: 20,
  borderTopLeftRadius: 18,
  borderTopRightRadius: 18,
},

doneBtn: {
  alignSelf: "flex-end",
  padding: 14,
},

doneText: {
  color: "#2563eb",
  fontWeight: "700",
  fontSize: 16,
},
});
