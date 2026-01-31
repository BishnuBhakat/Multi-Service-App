
// import { View, Text, Pressable, StyleSheet } from "react-native";
// import { useRouter } from "expo-router";


// import HeaderNav from "../../components/HeaderNav";


// const categories = ["All", "Necklace", "Rings", "Earrings", "Bracelets"];

// export default function JewelleryCategories() {
//   const router = useRouter();


//   return (
//       <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
//         <HeaderNav />
  
//         <Text style={styles.title}>Categories</Text>
  
//         {categories.map((cat) => (
//           <Pressable
//             key={cat}
//             style={styles.card}
//             onPress={() =>
//               router.push({
//                 pathname: `./jewellery/category/${cat}`, // ✅ FIXED
//               })
//             }
//           >
//             <Text style={styles.text}>{cat}</Text>
//           </Pressable>
//         ))}
//       </View>
//     );
//   }
  
//   const styles = StyleSheet.create({
//     title: {
//       fontSize: 22,
//       fontWeight: "700",
//       padding: 16,
//     },
//     card: {
//       backgroundColor: "#fff",
//       padding: 20,
//       marginHorizontal: 16,
//       marginBottom: 12,
//       borderRadius: 12,
//     },
//     text: {
//       fontSize: 18,
//       fontWeight: "600",
//     },
//   });
  