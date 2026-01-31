import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");

const slides = [
  { title: "Welcome", desc: "Shop groceries & clothing easily" },
  { title: "Fast Delivery", desc: "Quick and reliable service" },
  { title: "Best Deals", desc: "Save more every day" },
];

export default function Intro() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{slides[index].title}</Text>
        <Text style={styles.desc}>{slides[index].desc}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.activeDot]} />
        ))}
      </View>

          <Pressable
              style={styles.btn}
              onPress={async () => {
                  if (index < slides.length - 1) {
                      setIndex(index + 1);
                  } else {
                      // ✅ mark intro as seen
                      await AsyncStorage.setItem("seenIntro", "true");

                      // ✅ then go to login
                      router.replace("/auth/login");
                  }
              }}
          >
              <Text style={styles.btnText}>
                  {index === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
          </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "#2563eb",
    padding: 30,
    borderRadius: 20,
  },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  desc: { marginTop: 10, fontSize: 16, color: "#e0e7ff" },

  dots: { flexDirection: "row", justifyContent: "center", marginVertical: 20 },
  dot: { width: 8, height: 8, backgroundColor: "#c7d2fe", margin: 5, borderRadius: 4 },
  activeDot: { backgroundColor: "#2563eb" },

  btn: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
