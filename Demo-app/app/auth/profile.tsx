import { View, Text, TextInput, Pressable, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { apiFetch } from "@/src/services/apiClient";
import { Picker } from "@react-native-picker/picker";
import { Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Profile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  /* DOB */
  const [dob, setDob] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [dobText, setDobText] = useState("");

  /* Gender */
  const [gender, setGender] = useState("");
  const [showGenderPicker, setShowGenderPicker] = useState(false);

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

  /* ================= FORMAT DATE ================= */
  const formatDate = (date: Date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };

  /* ================= PICKER CHANGE ================= */
  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (!selectedDate) return;

    setDob(selectedDate);
    setDobText(formatDate(selectedDate));
  };

  /* ================= VALIDATION ================= */
  const validateDOB = (date: Date) => {
    if (date > maxDOB) return "You must be at least 13 years old";
    if (date < minDOB) return "Invalid date of birth";
    return null;
  };

  /* ================= SUBMIT ================= */
  const submitProfile = async () => {
    if (!name.trim()) return alert("Enter name");
    if (!email.trim()) return alert("Enter email");
    if (!gender) return alert("Please select gender");
    if (!dob) return alert("Select date of birth");

    const dobError = validateDOB(dob);
    if (dobError) return alert(dobError);

    const res = await apiFetch("/api/user/complete-profile", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        dob: formatDate(dob),
        gender,
      }),
    });

    // if (res.success) {
    //   router.replace("/(tabs)"); ----> here it's edited
    // } 
    if (res.success) {

  const token = await AsyncStorage.getItem("token");

  console.log("====== PROFILE COMPLETED TOKEN ======");
  console.log(token);
  console.log("====================================");

  router.replace("/(tabs)");
}

    else {
      alert("Failed to save profile");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      {/* NAME */}
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
              placeholder="Enter your full name"
              placeholderTextColor="#6b7280"
              style={styles.input}
              value={name}
              onChangeText={setName}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="#6b7280"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
          />


    {/* GENDER DROPDOWN */}
        <Text style={styles.label}>Gender *</Text>

        <Pressable
        style={styles.input}
        onPress={() => setShowGenderPicker(true)}
        >
        <Text style={{ color: gender ? "#111827" : "#6b7280", fontSize:16  }}>
            {gender || "-- Select Gender --"}
        </Text>
        </Pressable>

        <Modal
  visible={showGenderPicker}
  transparent
  animationType="fade"
>
  <View style={styles.modalOverlay}>

    {/* tap outside to close */}
    <Pressable
      style={StyleSheet.absoluteFill}
      onPress={() => setShowGenderPicker(false)}
    />

    {/* picker sheet */}
    <View style={styles.genderSheet}>

      <View style={styles.sheetHeader}>
        <Text style={styles.sheetTitle}>Select Gender</Text>

        <Pressable onPress={() => setShowGenderPicker(false)}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>

      <Picker
        selectedValue={gender}
        onValueChange={(value) => {
          if (!value) return;
          setGender(value);
        }}
        style={styles.picker}
      >
        <Picker.Item label="-- Select Gender --" value="" color="#6b7280" />
        <Picker.Item label="Male" value="Male" color="#111827" />
        <Picker.Item label="Female" value="Female" color="#111827" />
      </Picker>

    </View>
  </View>
</Modal>


  {/* DOB PICKER */}
      <Text style={styles.label}>Date of Birth *</Text>

      <Pressable style={styles.input} onPress={() => setShowPicker(true)}>
        {/* <Text style={{ color: dob ? "#000" : "#9ca3af" }}> */}
        <Text style={{ color: dob ? "#111827" : "#6b7280" }}>
          {dobText || "Select Date of Birth"}
        </Text>
      </Pressable>

          {showPicker && (
              <Modal transparent animationType="slide">
                  <View style={styles.modalOverlay}>
                      <View style={styles.pickerContainer}>

                          <Pressable
                              style={styles.doneBtn}
                              onPress={() => setShowPicker(false)}
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


    {/* SUBMIT */}
      <Pressable style={styles.button} onPress={submitProfile}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },

label: {
  fontWeight: "700",
  marginTop: 14,
  marginBottom: 6,
  fontSize: 14,
  color: "#111827",
},

input: {
  borderWidth: 1,
  borderColor: "#d1d5db",
  padding: 14,
  marginBottom: 8,
  borderRadius: 12,
  backgroundColor: "#ffffff",
  fontSize: 16,
},

  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  modalOverlay: {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.35)",
},

modalBox: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingBottom: 20,
},
dropdownBox: {
  borderWidth: 1.5,
  borderColor: "#cbd5e1",
  borderRadius: 12,
  paddingVertical: 14,
  paddingHorizontal: 14,
  backgroundColor: "#ffffff",
  justifyContent: "center",
},

dropdownText: {
  fontSize: 16,
  color: "#0f172a",   // dark visible text
  fontWeight: "600",
},

placeholderText: {
  color: "#64748b",   // visible grey (not faded)
},
option: {
  paddingVertical: 14,
  fontSize: 17,
  fontWeight: "600",
  color: "#0f172a",
},
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
genderSheet: {
  backgroundColor: "#fff",
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  paddingBottom: 25,
},
sheetHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 18,
  paddingVertical: 14,
  borderBottomWidth: 1,
  borderColor: "#e5e7eb",
},

sheetTitle: {
  fontSize: 16,
  fontWeight: "700",
  color: "#111827",
},

picker: {
  height: 220,
  width: "100%",
},
});
