import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  ArrowLeftIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchItems from "../../../components/SearchItems";
import { getSearchData } from "../../../utils";
import RecentlyViewedSection from "../../../components/RecentlyViewedSection";

export default function Search() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    if (searchData.length == 0) {
      getSearchData(setSearchData);
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
          placeholder="Type here to search for an item..."
          style={styles.search}
          onChangeText={setInput}
          value={input}
          cursorColor="red"
          autoFocus
        />
        {input.length === 0 && <MagnifyingGlassIcon size={25} color="gray" />}

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
          {/* RECENTLY VIEWED SECTION */}
          <Text
            style={{
              fontSize: 25,
              fontFamily: "serif",
            }}
          >
            Recently Viewed
          </Text>
          <View style={{ marginTop: 20 }}>
            <RecentlyViewedSection />
          </View>
        </View>
      )}
      <SearchItems searchData={searchData} input={input} setInput={setInput} />
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
});
