import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type RateParams = {
  productName?: string;
  productImage?: string;
  deliveredAt?: string;
};

const LABELS = ["Terrible", "Bad", "Okay", "Good", "Great"];

export default function RateProduct() {
  const router = useRouter();
  const params = useLocalSearchParams<RateParams>();

  const productName = typeof params.productName === "string" ? params.productName : "Product";
  const productImage =
    typeof params.productImage === "string" ? params.productImage : "https://picsum.photos/200";
  const deliveredAt = typeof params.deliveredAt === "string" ? params.deliveredAt : "Dec 22, 2025";

  const [rating, setRating] = useState<number>(3); // default like Flipkart (optional)
  const [review, setReview] = useState("");
  const [hasMedia, setHasMedia] = useState(false); // demo toggle

  const ratingLabel = useMemo(() => LABELS[Math.max(0, Math.min(4, rating - 1))], [rating]);

  const onSubmit = () => {
    if (!rating) return Alert.alert("Rating", "Please select a rating first.");
    // TODO: Save to API / storage
    Alert.alert("✅ Submitted", `Rating: ${rating} (${ratingLabel})`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn}>
          <Text style={styles.iconText}>✕</Text>
        </Pressable>

        <Text style={styles.topTitle}>Share your experience</Text>

        <View style={styles.pill}>
          <Text style={styles.pillText}>Only takes 2 min</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Product strip */}
        <View style={styles.productRow}>
          <Image source={{ uri: productImage }} style={styles.productImg} />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName} numberOfLines={1}>
              {productName}
            </Text>
            <Text style={styles.productMeta}>Delivered on {deliveredAt}</Text>
          </View>
        </View>

        {/* Stars + labels */}
        <View style={styles.starWrap}>
          {Array.from({ length: 5 }).map((_, i) => {
            const val = i + 1;
            const filled = val <= rating;
            return (
              <Pressable key={val} onPress={() => setRating(val)} style={styles.starItem}>
                <Text style={[styles.star, filled ? styles.starFilled : styles.starEmpty]}>★</Text>
                <Text style={[styles.starLabel, filled && styles.starLabelActive]}>
                  {LABELS[i]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Add photo/video */}
        <Text style={styles.sectionTitle}>Add photo/video</Text>
        <View style={styles.mediaCard}>
          <Text style={styles.mediaText}>
            The top 5% of our best reviewers usually add a photo/video
          </Text>

          <Pressable
            onPress={() => setHasMedia((s) => !s)}
            style={[styles.mediaBtn, hasMedia && { borderColor: "#16a34a" }]}
          >
            <Text style={[styles.mediaBtnText, hasMedia && { color: "#16a34a" }]}>
              📷+
            </Text>
          </Pressable>
        </View>

        {/* Tell us more */}
        <Text style={styles.sectionTitle}>Tell us more</Text>
        <View style={styles.textBox}>
          <TextInput
            value={review}
            onChangeText={setReview}
            placeholder="Share more details to help other customers"
            placeholderTextColor="#9ca3af"
            style={styles.input}
            multiline
          />
        </View>
      </ScrollView>

      {/* Submit */}
      <View style={styles.footer}>
        <Pressable style={styles.submitBtn} onPress={onSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eef2f7",
  },
  iconBtn: { padding: 6 },
  iconText: { fontSize: 18, fontWeight: "900" },
  topTitle: { flex: 1, fontSize: 18, fontWeight: "900" },
  pill: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  pillText: { fontWeight: "800", color: "#111827", fontSize: 12 },

  productRow: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eef2f7",
    alignItems: "center",
  },
  productImg: { width: 54, height: 54, borderRadius: 10, backgroundColor: "#e5e7eb" },
  productName: { fontWeight: "900", fontSize: 15, color: "#111827" },
  productMeta: { marginTop: 4, color: "#6b7280", fontWeight: "700" },

  starWrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 18,
    paddingHorizontal: 8,
  },
  starItem: { alignItems: "center", width: 64 },
  star: { fontSize: 44, lineHeight: 48 },
  starFilled: { color: "#facc15" },
  starEmpty: { color: "#d1d5db" },
  starLabel: { marginTop: 6, fontSize: 12, color: "#6b7280", fontWeight: "800" },
  starLabelActive: { color: "#111827" },

  sectionTitle: {
    marginTop: 10,
    paddingHorizontal: 12,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },

  mediaCard: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  mediaText: { flex: 1, color: "#111827", fontWeight: "700" },
  mediaBtn: {
    width: 54,
    height: 54,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#2874F0",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  mediaBtnText: { fontSize: 22, fontWeight: "900", color: "#2874F0" },

  textBox: {
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    padding: 12,
  },
  input: { minHeight: 120, fontSize: 15, fontWeight: "700", color: "#111827" },

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eef2f7",
  },
  submitBtn: {
    backgroundColor: "#2874F0",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
