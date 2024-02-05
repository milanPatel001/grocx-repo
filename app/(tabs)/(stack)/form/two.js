import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import { useRouter } from "expo-router";
import {
  ArrowLeftIcon,
  ChevronDoubleDownIcon,
} from "react-native-heroicons/outline";

export default function AddFormTwo() {
  const [location, setLoc] = useState({ shop_name: "None" });
  const [error, setError] = useState(false);

  const { state } = useFormData();
  const router = useRouter();

  const [baseViewDimensions, setBaseViewDimensions] = useState({
    width: 0,
    height: 0,
  });

  const onBaseViewLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setBaseViewDimensions({ width, height });
  };

  useEffect(() => {
    if (state.location) {
      setLoc(state.location);
    }
  }, [state.location]);

  const handleNext = (version) => {
    if (version === "v1") {
      if (!state.location || location.shop_name === "None") {
        setError(true);
      } else {
        router.push("/form/three");
      }
    } else if (version === "v2") {
      router.push("/form/twoV2");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
      <ArrowLeftIcon
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
        }}
        size={30}
        color="black"
        onPress={() => router.back()}
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
              fontSize: 36,
              fontFamily: "serif",
            }}
          >
            Select a Location
          </Text>
          <View style={styles.locContainer}>
            <TouchableOpacity
              style={{
                ...styles.locModal,
                borderColor: error ? "red" : "black",
              }}
              onPress={() => router.push("/form/locationModal")}
            >
              <Text numberOfLines={1} style={{ fontSize: 20 }}>
                {location.shop_name}
              </Text>
              {location.shop_name === "None" && (
                <ChevronDoubleDownIcon
                  style={{ position: "absolute", right: 2 }}
                  size={24}
                  color="black"
                />
              )}
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={styles.buttonV1}
              onPress={() => handleNext("v1")}
            >
              <Text style={{ color: "white" }}>Next</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
          >
            <Text style={{ fontFamily: "serif" }}>
              ----------------------------- OR -----------------------------
            </Text>
          </View>

          {/* Bottom */}
          <View style={{ alignItems: "center", gap: 10 }}>
            <Text style={{ fontFamily: "serif", fontSize: 16 }}>
              Can't find the location in the list?
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
                <Text style={{ color: "#d63c31" }}>Add shop's location</Text>
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
    padding: 10,
    height: "75%",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  locContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  locModal: {
    height: 50,
    width: "100%",
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
    borderColor: "red",
    borderWidth: 1,
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
});
