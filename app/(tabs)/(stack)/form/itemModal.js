import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { XMarkIcon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { useData } from "../../../../DataContext";
import { useFormData } from "../../../../FormContext";

export default function ItemModal() {
  const [input, setInput] = useState("");
  //const searchData = ["hel", "bel", "sel"];
  const [searchData, setSearchData] = useState([]);
  const router = useRouter();

  const { state } = useData();
  const { updateItem } = useFormData();

  useEffect(() => {
    if (state.homeData) {
      //console.log(state.homeData);
      const a = [{ id: "None", name: "None" }, ...state.homeData];
      setSearchData(a);
    }
  }, [state.homeData]);

  const handlePress = (item) => {
    const itemObj = { ...item };
    itemObj["update"] = true;

    updateItem(itemObj);
    router.back();
  };

  return (
    <View style={styles.main}>
      <View style={styles.searchWrapper}>
        <MagnifyingGlassIcon size={25} color={"black"} />
        <TextInput
          placeholder="Search for an item ..."
          style={styles.search}
          onChangeText={setInput}
          value={input}
          cursorColor="red"
        />

        {input.length > 0 && (
          <XMarkIcon size={30} color="red" onPress={() => setInput("")} />
        )}
      </View>

      <ScrollView style={styles.outputList}>
        {searchData
          ?.filter((i) => {
            return i.name.toLowerCase().startsWith(input.toLowerCase());
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
              <Pressable onPress={() => handlePress(f)}>
                <Text style={{ fontSize: 20 }}>{f.name}</Text>
              </Pressable>
            </View>
          ))}
      </ScrollView>
    </View>
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
    borderWidth: 1,
    borderColor: "blue",
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
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});
