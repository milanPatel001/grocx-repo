import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../../firebaseConfig";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "../../../components/Navbar";
import ItemCard from "../../../components/ItemCard";
import { collection } from "firebase/firestore";
import { useData } from "../../../DataContext";
import { PlusCircleIcon } from "react-native-heroicons/solid";

const cat = [
  "Biscuit",
  "Drinks",
  "Pizza",
  "Ice-Cream",
  "Vegetables",
  "Chips",
  "Sauce",
];

const arr = [1000, 1001, 1002, 1003, 1004, 1005];

export default function App() {
  const router = useRouter();
  const authState = useAuthState(auth);

  const { state } = useData();

  const [data, setData] = useState([]);

  useEffect(() => {
    if (state.catData) {
      setData(state.catData);
    }
  }, [state.catData]);

  if (!authState[0]?.uid) {
    return (
      <View>
        <Text>Still Loading...........</Text>
      </View>
    );
  }

  return (
    <>
      <SafeAreaView
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          gap: 15,
          position: "relative",
        }}
      >
        {/* Navbar */}
        <Navbar labelStatus={true} />

        {/* Main section */}
        <View style={styles.main}>
          <ScrollView>
            {/* <Text onPress={() => router.push("/login")}>Login Screen</Text> */}

            {/* <Text style={{ fontSize: 40, marginBottom: 5, marginLeft: 20 }}>
              Categories
            </Text> */}
            {/* Categories */}
            {Object.keys(data)?.map(
              (c, i) =>
                state.catData[c]?.length > 0 && (
                  <View key={i} style={{ gap: 10 }}>
                    <Text
                      style={{
                        fontSize: 30,
                        fontFamily: "serif",
                        marginLeft: 20,
                      }}
                    >
                      {c}
                    </Text>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{ paddingLeft: 10 }}
                    >
                      {/* Category Items */}
                      {state.catData[c]?.map((item) => (
                        <ItemCard key={item.id} item={item} />
                      ))}
                    </ScrollView>
                  </View>
                )
            )}
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/form/one")}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
          }}
        >
          <PlusCircleIcon
            size={60}
            stroke="black"
            strokeWidth="0.5"
            color="red"
            style={{ zIndex: 50 }}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  main: {},
});

//  borderWidth: 2,
//borderColor: "black",
