// import {
//   View,
//   Text,
//   FlatList,
//   Image,
//   Pressable,
//   StyleSheet,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import HeaderNav from "../../../components/HeaderNav";
// import { jewelleryItems } from "../../data/jewelleryData";
// import { useCart } from "../../context/CartContext";

// export default function CategoryProducts() {
//   const params = useLocalSearchParams();
//   const router = useRouter();
//   const { addToCart } = useCart();

//   const category =
//       typeof params.categories === "string" ? params.categories : "";
  
//     // ✅ FILTER WORKS NOW
//     const filteredItems = jewelleryItems.filter(
//       (item) => item.category === category
//     );
//     return (
//         <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
//           <HeaderNav />
    
//           <Text style={styles.title}>{category}</Text>
    
//           {filteredItems.length === 0 && (
//             <Text style={{ padding: 20 }}>No items found</Text>
//           )}
    
//           <FlatList
//             data={filteredItems}
//             keyExtractor={(item) => item.id}
//             numColumns={2}
//             contentContainerStyle={{ padding: 10 }}
//             renderItem={({ item }) => (
//               <View style={styles.card}>
//                 <Pressable
//                   onPress={() =>
//                     router.push({
//                       pathname: "/product/[id]",
//                       params: { id: item.id },
//                     })
//                   }
//                 >
//                   <Image source={{ uri: item.image }} style={styles.image} />
//                   <Text style={styles.name}>{item.name}</Text>
//                   <Text style={styles.price}>₹{item.price}</Text>
//                 </Pressable>
    
//                 <Pressable
//                   style={styles.addBtn}
//                   onPress={() =>
//                     addToCart({
//                       id: item.id,
//                       name: item.name,
//                       price: item.price,
//                       image: item.image,
//                       quantity: 1,
//                       type: "grocery",
//                     })
//                   }
//                 >
//                   <Text style={{ color: "#fff" }}>ADD</Text>
//                 </Pressable>
//               </View>
//             )}
//           />
//         </View>
//       );
//     }
    
//     const styles = StyleSheet.create({
//       title: {
//         fontSize: 22,
//         fontWeight: "700",
//         padding: 12,
//       },
//       card: {
//         backgroundColor: "#fff",
//         borderRadius: 12,
//         padding: 10,
//         margin: 6,
//         flex: 1,
//       },
//       image: {
//         height: 100,
//         borderRadius: 8,
//       },
//       name: {
//         fontSize: 14,
//         fontWeight: "600",
//         marginTop: 6,
//       },
//       price: {
//         fontWeight: "bold",
//         marginVertical: 4,
//       },
//       addBtn: {
//         backgroundColor: "#22c55e",
//         paddingVertical: 6,
//         borderRadius: 6,
//         alignItems: "center",
//         marginTop: 6,
//       },
//     });
    