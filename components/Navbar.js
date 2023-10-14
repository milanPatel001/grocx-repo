import { useNavigation, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { StatusBar } from "expo-status-bar";

export default function Navbar({ labelStatus, children }) {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <StatusBar backgroundColor="white" />
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
        <TouchableOpacity
          style={{ marginRight: 30 }}
          onPress={() => router.push("/search")}
        >
          <MagnifyingGlassIcon size={30} color="black" />
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
  },
  left: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 20,
    alignItems: "center",
    gap: 15,
  },
});
