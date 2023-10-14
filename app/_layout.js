import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
  return (
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
