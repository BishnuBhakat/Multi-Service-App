// import { Redirect } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useEffect, useState } from "react";

// export default function Entry() {
//   const [ready, setReady] = useState(false);
//   type AppRoute =
//   | "/auth/intro"
//   | "/auth/phone"
//   | "/(tabs)";

// const [route, setRoute] = useState<AppRoute | null>(null);


//   useEffect(() => {
//     const check = async () => {
//       const seenIntro = await AsyncStorage.getItem("seenIntro");
//       // const user = await AsyncStorage.getItem("user"); // or token
//       const token = await AsyncStorage.getItem("token");

//       if (!seenIntro) {
//         setRoute("/auth/intro");
//       } else if (!token) {
//         setRoute("/auth/phone");
//       } else {
//         setRoute("/(tabs)");
//       }

//       setReady(true);
//     };

//     check();
//   }, []);

//  return route ? <Redirect href={route} /> : null;

// }


import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/config/api";

export default function Entry() {
  const [route, setRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {                                        //----->
          console.log("====== AUTO LOGIN TOKEN ======");
          console.log(token);
          console.log("==============================");  //---->
        }

        /* 1️⃣ Not logged in → go phone auth */
        if (!token) {
          setRoute("/auth/phone");
          return;
        }

        /* 2️⃣ Token exists → check profile status */
        const res = await fetch(`${API_BASE_URL}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!data?.success || !data?.user) {
          setRoute("/auth/phone");
          return;
        }

        /* 3️⃣ Profile not completed → profile page */
        if (!data.user.profileCompleted) {
          setRoute("/auth/profile");
          return;
        }

        /* 4️⃣ Everything ok → home */
        setRoute("/(tabs)");
      } catch (err) {
        console.log("ENTRY CHECK ERROR:", err);
        setRoute("/auth/phone");
      }
    };

    checkAuth();
  }, []);

  if (!route) return null;

  return <Redirect href={route as any} />;
}
