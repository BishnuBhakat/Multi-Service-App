import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function Entry() {
  const [ready, setReady] = useState(false);
  type AppRoute =
  | "/auth/intro"
  | "/auth/login"
  | "/(tabs)";

const [route, setRoute] = useState<AppRoute | null>(null);


  useEffect(() => {
    const check = async () => {
      const seenIntro = await AsyncStorage.getItem("seenIntro");
      const user = await AsyncStorage.getItem("user"); // or token

      if (!seenIntro) {
        setRoute("/auth/intro");
      } else if (!user) {
        setRoute("/auth/login");
      } else {
        setRoute("/(tabs)");
      }

      setReady(true);
    };

    check();
  }, []);

 return route ? <Redirect href={route} /> : null;

}
