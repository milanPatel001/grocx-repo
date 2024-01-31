import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ArrowUpLeftIcon } from "react-native-heroicons/outline";
import { useRouter } from "expo-router";

export default function SearchItems({ searchData, input, setInput }) {
  const router = useRouter();
  return (
    <>
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
              <View key={f.id} style={styles.listItem}>
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

                <View style={styles.icon}>
                  <TouchableOpacity onPress={() => setInput(f.name)}>
                    <ArrowUpLeftIcon size={20} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  outputList: {
    backgroundColor: "white",
    paddingHorizontal: 15,
  },

  listItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 5,
  },
});
