import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { AuthProvider } from "../AuthContext";

export default function Layout() {
  return (
    <>
      <StatusBar backgroundColor="#d63c31" style="light" />
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </>
  );
}
