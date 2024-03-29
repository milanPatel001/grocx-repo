import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "../../components/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { MinusCircleIcon } from "react-native-heroicons/solid";
import { useData } from "../../DataContext";
import { handleFavoritesDeletion } from "../../utils";
import { useRouter } from "expo-router";

export default function Favourites() {
  const authState = useAuthState(auth);
  const [active, setActive] = useState("items");
  const [data, setData] = useState([]);

  const router = useRouter();
  const { state, updateFavData } = useData();

  useEffect(() => {
    if (state.favData) {
      setData(state.favData);
    }
  }, [state.favData]);

  if (!authState[0]?.uid) {
    return (
      <SafeAreaView>
        <View>
          <Text>First Log in....</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <Navbar labelStatus={true} />

      <View style={styles.container}>
        <ScrollView>
          {data.length > 0 &&
            data.map((item) => (
              <View
                style={{
                  backgroundColor: "white",
                  flexDirection: "row",
                }}
                key={item.id}
              >
                <Pressable
                  style={styles.image}
                  onPress={() => router.push(`/item/${item.id}`)}
                >
                  <Image
                    source={{
                      uri: item.img,
                    }}
                    style={{
                      height: "100%",
                      width: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </Pressable>

                <Pressable
                  style={styles.text}
                  onPress={() => router.push(`/item/${item.id}`)}
                >
                  <Text
                    style={{
                      fontFamily: "serif",
                      fontWeight: 600,
                      fontSize: 20,
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text>{item.weight}</Text>
                  <Text>{item.category[0].toUpperCase()}</Text>
                </Pressable>
                <View
                  style={{
                    flex: 0.1,

                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      handleFavoritesDeletion(
                        item.id,
                        state,
                        authState,
                        updateFavData
                      )
                    }
                  >
                    <MinusCircleIcon size={25} color={"red"} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    paddingHorizontal: 20,
    gap: 10,
    marginTop: 10,
  },
  image: {
    height: 120,
    width: 150,
    alignItems: "center",
    flex: 0.4,
  },
  text: {
    flex: 0.5,
    justifyContent: "center",
    marginLeft: 10,
  },
});

{
  /* hidden buttons (WIP)
      {false && (
        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
            paddingHorizontal: 20,
            gap: 20,
          }}
        >
          <TouchableOpacity
            style={{
              padding: 10,
              paddingHorizontal: 25,
              borderRadius: 20,
              borderColor: "green",
              backgroundColor: active === "items" ? "#20a87f" : "white",
              borderWidth: 1,
            }}
            onPress={() => setActive("items")}
          >
            <Text
              style={{
                color: active === "items" ? "white" : "green",
              }}
            >
              Items
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              paddingHorizontal: 25,
              borderRadius: 20,
              borderColor: "blue",
              backgroundColor: active === "shops" ? "#219fed" : "white",
              borderWidth: 1,
            }}
            onPress={() => setActive("shops")}
          >
            <Text
              style={{
                color: active === "shops" ? "white" : "blue",
              }}
            >
              Shops
            </Text>
          </TouchableOpacity>
        </View>
      )} */
}
