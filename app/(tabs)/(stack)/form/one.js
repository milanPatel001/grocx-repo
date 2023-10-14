import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import ImgPicker from "../../../../components/ImgPicker";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import CategoryPicker from "../../../../components/CategoryPicker";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

export default function AddFormOne() {
  const router = useRouter();

  const [sub, setSub] = useState(false);
  const [item, setItem] = useState({ name: "None" });
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");

  const [err, setErr] = useState({
    name: false,
    weight: false,
    cat: false,
    img: false,
  });

  const { state, updateItem, updateCategories, updateImage } = useFormData();

  useEffect(() => {
    if (state.item) {
      //console.log(state.item);
      setItem(state.item);
    }
  }, [state.item]);

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

    if (!state.item || state.item?.name === "None") {
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
    } else {
      router.push("/form/two");
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
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
          gap: 25,
          paddingTop: 20,
          height: "100%",

          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text style={{ fontWeight: 500, fontSize: 20 }}>Item: </Text>

          <TouchableOpacity
            style={{
              height: 30,
              width: "60%",
              borderWidth: 1,
              borderRadius: 10,
              elevated: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => router.push("/form/itemModal")}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Heading */}
        <View
          style={{ justifyContent: "center", alignItems: "center", gap: 10 }}
        >
          <Text>------------------------ OR -----------------------</Text>
        </View>

        {/* Bottom section */}

        <View style={{ gap: 20 }}>
          <Text>Enter details below (if item not found in above list)</Text>
          {/* Text Input section */}
          <View style={{ flexDirection: "row", gap: 20 }}>
            <View
              style={{
                width: "60%",
                gap: 4,
              }}
            >
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter item name..."
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
              <TextInput
                value={weight}
                onChangeText={setWeight}
                style={{
                  padding: 5,
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: err.weight ? "red" : "black",
                }}
                placeholder="Weight"
              />
              {err.weight && (
                <Text style={{ color: "red", fontSize: 10 }}>
                  * Enter item's weight
                </Text>
              )}
            </View>
          </View>

          {/* Image Picker */}
          <View>
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
            }}
          >
            <Text style={{ fontFamily: "serif", fontSize: 15 }}>
              Categories:{" "}
            </Text>

            <CategoryPicker />
          </View>
          {err.cat && (
            <Text style={{ color: "red", fontSize: 10 }}>
              * Pick atleast one category
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
            onPress={() => handleNext()}
          >
            <Text style={{ color: "white" }}>Go to Next Step</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
