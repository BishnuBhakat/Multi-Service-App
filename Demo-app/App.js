import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/screens/HomeScreen";
import ClothingScreen from "./src/screens/ClothingScreen";
import GroceryScreen from "./src/screens/GroceryScreen";
import HotelScreen from "./src/screens/HotelScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      {/* <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Clothing" component={ClothingScreen} />
        <Tab.Screen name="Grocery" component={GroceryScreen} />
        <Tab.Screen name="Hotels" component={HotelScreen} />
      </Tab.Navigator> */}
    </NavigationContainer>
  );
}
