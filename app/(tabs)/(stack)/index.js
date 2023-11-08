import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Redirect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../../firebaseConfig";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Navbar from "../../../components/Navbar";
import ItemCard from "../../../components/ItemCard";
import { collection } from "firebase/firestore";
import { useData } from "../../../DataContext";
import { PlusCircleIcon } from "react-native-heroicons/solid";
import { useAuth } from "../../../AuthContext";

export default function App() {
  const router = useRouter();

  const { state } = useData();
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (user) {
      if (state.catData) {
        setData(state.catData);
      }
    }
  }, [state.catData, user]);

  if (!user?.uid) {
    return <Redirect href="/login" />;
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
  main: {
    marginBottom: 96,
  },
});

//  borderWidth: 2,
//borderColor: "black",
