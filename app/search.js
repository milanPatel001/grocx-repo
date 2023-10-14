import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import {
  ArrowLeftIcon,
  XMarkIcon,
  ArrowUpLeftIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function Search() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const [searchData, setSearchData] = useState([]);

  const arr = ["one", "two", "three", "thhh", "tuo", "tok", "lop", "fo", "add"];

  const getSearchData = async () => {
    const querySnapshot = await getDocs(collection(db, "search"));

    const d = [];

    querySnapshot.forEach((doc) => {
      d.push({ id: doc.id, ...doc.data() });
    });
    //console.log(d);
    setSearchData(d);
  };
  useEffect(() => {
    if (searchData.length == 0) {
      getSearchData();
    }
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar backgroundColor="#d63c31" style="light" />
      <View style={styles.searchWrapper}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={30} color={"red"} />
        </TouchableOpacity>

        <TextInput
          placeholder="What can we help you find ...."
          style={styles.search}
          onChangeText={setInput}
          value={input}
          cursorColor="red"
        />

        {input.length > 0 && (
          <XMarkIcon size={30} color="red" onPress={() => setInput("")} />
        )}
      </View>
      {input.length === 0 && (
        <View
          style={{
            backgroundColor: "white",
            marginHorizontal: 15,
            marginTop: 5,
          }}
        >
          <Text style={{ fontSize: 25 }}>Recently Viewed</Text>
        </View>
      )}
      <ScrollView style={styles.outputList}>
        {searchData.length > 0 &&
          searchData
            ?.filter((obj) => {
              return (
                input !== "" &&
                obj.name.toLowerCase().startsWith(input.toLowerCase())
              );
            })
            .map((f) => (
              <View
                key={f.id}
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/item/[info]",
                      params: { info: f.id },
                    })
                  }
                >
                  <Text style={{ fontSize: 20 }}>{f.name}</Text>
                </Pressable>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    paddingRight: 5,
                  }}
                >
                  <TouchableOpacity onPress={() => setInput(f.name)}>
                    <ArrowUpLeftIcon size={20} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    flex: 1,
    backgroundColor: "white",
  },
  searchWrapper: {
    width: "100%",
    flexDirection: "row",
    height: 60,
    position: "relative",

    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  search: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    flex: 1,
    fontSize: 18,
  },
  outputList: {
    backgroundColor: "white",
    paddingHorizontal: 15,
  },
});
