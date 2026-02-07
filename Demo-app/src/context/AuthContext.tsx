import { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = async (token: string) => {
    await AsyncStorage.setItem("token", token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};