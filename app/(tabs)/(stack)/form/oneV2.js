import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import ImgPicker from "../../../../components/ImgPicker";
import CategoryPicker from "../../../../components/CategoryPicker";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

export default function OneV2() {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");

  const [err, setErr] = useState({
    name: false,
    weight: false,
    cat: false,
    img: false,
  });

  const router = useRouter();

  const { state, updateItem } = useFormData();

  useEffect(() => {
    if (state.cat) {
      const e = { ...err };
      e.cat = false;
      setErr(e);
    }
  }, [state.cat]);

  const handleNext = () => {
    // router.push("/form/two");

    const error = { name: false, weight: false, cat: false, img: false };

    if (name.length === 0) error.name = true;

    if (weight.length === 0) error.weight = true;

    if (!state.cat) error.cat = true;

    if (state.cat) {
      let foundOne = false;
      for (let i = 0; i < state.cat.length; i++) {
        if (state.cat[i].ch) {
          foundOne = true;
          break;
        }
      }

      if (!foundOne) error.cat = true;
    }

    if (!state.img) error.img = true;

    if (state.img && state.cat && name.length > 0 && weight.length > 0) {
      let catg = state.cat?.filter((c) => c.ch !== false);
      catg = catg.map((c) => c.cat);

      const getId = (str) => {
        const arr = str.split(" ");
        let id = "";

        for (let i = 0; i < arr.length; i++) {
          id = id + arr[i].substring(0, 3).toUpperCase();
        }

        return id;
      };

      const item = {
        update: false,
        id: getId(name), // calculate id
        category: catg,
        name: name.trim(),
        weight: weight.trim(),
        img: state.img,
        created_at: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      };

      //console.log(item);

      updateItem(item);

      router.push("/form/two");
    } else {
      setErr(error);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white", height: "100%" }}>
      <ArrowLeftIcon
        size={30}
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
        }}
        color="black"
        onPress={() => router.back()}
      />

      <View
        style={{
          marginHorizontal: 20,
          marginTop: 32,
          backgroundColor: "white",
          borderRadius: 20,
          padding: 20,
          gap: 20,
          borderWidth: 1,
          height: "75%",
        }}
      >
        <Text style={{ fontSize: 36 }}>Enter item details</Text>
        <View
          style={{
            gap: 40,
            height: "75%",
          }}
        >
          {/* Text Input section */}
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View
              style={{
                width: "60%",
                gap: 4,
              }}
            >
              <Text>Item Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Item name..."
                style={{
                  borderColor: err.name ? "red" : "black",
                  borderWidth: 1,
                  borderRadius: 5,
                  padding: 5,
                }}
              />

              {err.name && (
                <Text style={{ color: "red", fontSize: 10 }}>
                  * Enter item's name
                </Text>
              )}
            </View>

            <View
              style={{
                width: "35%",
                gap: 4,
              }}
            >
              <Text>Weight</Text>
              <TextInput
                value={weight}
                onChangeText={setWeight}
                style={{
                  padding: 5,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: err.weight ? "red" : "black",
                }}
                placeholder="oz, lbs, kg ..."
              />
              {err.weight && (
                <Text style={{ color: "red", fontSize: 10 }}>
                  * Enter item's weight
                </Text>
              )}
            </View>
          </View>

          {/* Image Picker */}
          <View style={{ alignItems: "center" }}>
            <ImgPicker />
            {err.img && (
              <Text
                style={{
                  color: "red",
                  fontSize: 10,
                  marginTop: 10,
                  marginHorizontal: 33,
                }}
              >
                * Pick item's photo from the library
              </Text>
            )}
          </View>

          {/* Categories section */}
          <View
            style={{
              flexDirection: "row",
              gap: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flexBasis: "25%" }}>
              <Text style={{ fontFamily: "serif", fontSize: 15 }}>
                Category:{" "}
              </Text>
              {err.cat && (
                <Text style={{ color: "red", fontSize: 10 }}>
                  * Pick atleast one category
                </Text>
              )}
            </View>

            <CategoryPicker />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#d63c31",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
              }}
              onPress={() => handleNext()}
            >
              <Text style={{ color: "white" }}>Go To Next Step</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
