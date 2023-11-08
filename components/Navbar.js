import { useNavigation, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebaseConfig";

import { useAuth } from "../AuthContext";

export default function Navbar({ labelStatus, children }) {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <StatusBar backgroundColor="#d63c31" style="light" />
      {labelStatus && (
        <View style={styles.left}>
          <Text
            style={{
              fontWeight: 700,
              fontSize: 35,
              fontFamily: "serif",
              color: "black",
            }}
          >
            GrocX
          </Text>
        </View>
      )}

      <View style={{ marginLeft: 20, marginTop: 25 }}>{children}</View>

      <View style={styles.right}>
        <TouchableOpacity onPress={() => router.push("/search")}>
          <MagnifyingGlassIcon size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "",
              "Do you want to sign out?",
              [
                {
                  text: "Yes",
                  onPress: handleSignOut,
                },
                {
                  text: "No",
                  style: "cancel",
                },
              ],
              {
                cancelable: true,
              }
            )
          }
        >
          <ArrowRightOnRectangleIcon size={28} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    padding: 2,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 70,
  },
  right: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: 10,
    gap: 20,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
    gap: 15,
  },
});
