import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  addAddress,
  updateAddress,
  getAddresses,
} from "@/src/services/addressService";

type AddressFormState = {
  addressType: "HOME" | "WORK";
  fullName: string;
  phone: string;
  house: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
};

export default function AddressForm() {
  const router = useRouter();
  const { id, cartType } = useLocalSearchParams<{ 
  id?: string; 
  cartType?: string;
}>();

  const isEdit = !!id;

  const [form, setForm] = useState<AddressFormState>({
    addressType: "HOME",
    fullName: "",
    phone: "",
    house: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* ================= LOAD ADDRESS FOR EDIT ================= */
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const res = await getAddresses();
        if (!res?.success || !Array.isArray(res.addresses)) return;

        const found = res.addresses.find((a: any) => a._id === id);
        if (!found) return;

        setForm({
          addressType: found.addressType || "HOME",
          fullName: found.fullName || "",
          phone: found.phone || "",
          house: found.house || "",
          area: found.area || "",
          city: found.city || "",
          state: found.state || "",
          pincode: found.pincode || "",
        });
      } catch (err) {
        console.log("LOAD ADDRESS ERROR:", err);
      }
    })();
  }, [id, isEdit]);

  /* ================= SAVE ================= */
  const onSave = async () => {
  const values = Object.values(form);

  if (values.some((v) => !String(v).trim())) {
    Alert.alert("All fields are required");
    return;
  }

  try {
    let res;

    if (isEdit) {
      res = await updateAddress(id as string, form);
    } else {
      res = await addAddress(form);
    }

    if (!res?.success) {
      Alert.alert("Error", res?.message || "Failed to save address");
      return;
    }

    // ✅ Controlled redirect
    if (cartType) {
      router.replace({
        pathname: "/addresses",
        params: { cartType },
      });
    } else {
      router.replace("/addresses");
    }

  } catch (err) {
    Alert.alert("Error", "Something went wrong while saving address");
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ADDRESS TYPE */}
      <View style={styles.row}>
        {["HOME", "WORK"].map((type) => (
          <Pressable
            key={type}
            onPress={() =>
              setForm({ ...form, addressType: type as "HOME" | "WORK" })
            }
            style={[
              styles.typeBtn,
              form.addressType === type && styles.typeBtnActive,
            ]}
          >
            <Text
              style={[
                styles.typeText,
                form.addressType === type && styles.typeTextActive,
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* INPUTS */}
      {[
        ["fullName", "Full Name"],
        ["phone", "Phone"],
        ["house", "House / Flat"],
        ["area", "Area"],
        ["city", "City"],
        ["state", "State"],
        ["pincode", "Pincode"],
      ].map(([key, label]) => (
        <TextInput
          key={key}
          placeholder={label}
          value={(form as any)[key]}
          onChangeText={(t) => setForm({ ...form, [key]: t })}
          style={styles.input}
        />
      ))}

      <Pressable style={styles.btn} onPress={onSave}>
        <Text style={styles.btnText}>
          {isEdit ? "UPDATE ADDRESS" : "SAVE ADDRESS"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  typeBtnActive: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },

  typeText: {
    fontWeight: "800",
    color: "#0f172a",
  },

  typeTextActive: {
    color: "#fff",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 16,
  },
});
