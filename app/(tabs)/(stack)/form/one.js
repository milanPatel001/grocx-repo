import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import {
  ArrowLeftIcon,
  ChevronDoubleDownIcon,
} from "react-native-heroicons/outline";

export default function AddFormOne() {
  const router = useRouter();

  const [item, setItem] = useState({ name: "None" });
  const [err, setErr] = useState(false);

  const { state } = useFormData();

  const [baseViewDimensions, setBaseViewDimensions] = useState({
    width: 0,
    height: 0,
  });

  const onBaseViewLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setBaseViewDimensions({ width, height });
  };

  useEffect(() => {
    if (state.item) {
      //console.log(state.item);
      setItem(state.item);
    }
  }, [state.item]);

  const handleNext = (version) => {
    if (version === "v1") {
      if (!state.item || state.item?.name === "None") {
        setErr(true);
      } else {
        router.push("/form/two");
      }
    } else if (version === "v2") {
      router.push("/form/oneV2");
    }
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: "100%",
      }}
    >
      <ArrowLeftIcon
        size={30}
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
        }}
        color="black"
        onPress={() => router.replace("/")}
      />
      <View>
        <View
          style={{
            width: baseViewDimensions.width,
            height: baseViewDimensions.height,
            ...styles.overlay,
          }}
        ></View>
        <View
          style={{
            width: baseViewDimensions.width,
            height: baseViewDimensions.height,
            ...styles.overlay2,
          }}
        ></View>
        <View style={styles.container} onLayout={onBaseViewLayout}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: 40,
              fontFamily: "serif",
            }}
          >
            Select an Item
          </Text>
          <View style={styles.itemContainer}>
            <TouchableOpacity
              style={{
                ...styles.itemModal,
                borderColor: err ? "red" : "black",
              }}
              onPress={() => router.push("/form/itemModal")}
            >
              <Text numberOfLines={1} style={{ fontSize: 20 }}>
                {item.name}
              </Text>
              {item.name === "None" && (
                <ChevronDoubleDownIcon
                  style={{ position: "absolute", right: 2 }}
                  size={24}
                  color="black"
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <TouchableOpacity
              style={styles.buttonV1}
              onPress={() => handleNext("v1")}
            >
              <Text style={{ color: "white" }}>Go to Next Step</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
          >
            <Text style={{ fontFamily: "serif" }}>
              ----------------------------- OR -----------------------------
            </Text>
          </View>

          {/* Bottom Part*/}
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text style={{ fontFamily: "serif", fontSize: 16 }}>
              Can't find the item in the list?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                style={styles.buttonV2}
                onPress={() => handleNext("v2")}
              >
                <Text style={{ color: "#d63c31" }}>Add your item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 32,
    gap: 25,
    height: "100%",
    padding: 10,
    height: "75%",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 32,
  },
  overlay2: {
    position: "absolute",
    top: 5,
    right: 5,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    marginHorizontal: 20,
    marginTop: 32,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  itemModal: {
    height: 50,
    width: "70%",
    borderWidth: 1,
    borderRadius: 10,
    elevated: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    position: "relative",
  },
  buttonV1: {
    backgroundColor: "#d63c31",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonV2: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: "#d63c31",
    borderWidth: 1,
  },
});
