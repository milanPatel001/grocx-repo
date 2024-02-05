import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import { router, useRouter } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

export default function TwoV2() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [shop_name, setShopName] = useState("");
  const [ste, setState] = useState("");
  const [addr, setAddress] = useState("");

  const [err, setErr] = useState({
    city: false,
    state: false,
    country: false,
    address: false,
    shop_name: false,
  });

  const { state, updateLocation } = useFormData();

  const handleNext = () => {
    const error = {
      shop_name: false,
      address: false,
      city: false,
      country: false,
      state: false,
    };

    if (
      shop_name.length > 0 &&
      addr.length > 0 &&
      city.length > 0 &&
      country.length > 0 &&
      ste.length > 0
    ) {
      const getId = () => {
        const arr1 = shop_name.split(" ");
        const arr2 = addr.split(" ");
        let id = "";

        for (let i = 0; i < arr1.length; i++) {
          id = id + arr1[i].substring(0, 3).toUpperCase();
        }

        id += arr2[0].toUpperCase();
        if (arr2.length > 1) id += arr2[arr2.length - 1].toUpperCase();
        return id;
      };

      const obj = {
        id: getId(), // calculate id
        shop_name: shop_name,
        city,
        country,
        state: ste,
        address: addr,
        update: false,
      };

      updateLocation(obj);

      router.push("/form/three");
    } else {
      if (shop_name.length === 0) error.shop_name = true;
      if (addr.length === 0) error.address = true;
      if (city.length === 0) error.city = true;
      if (country.length === 0) error.country = true;
      if (ste.length === 0) error.state = true;

      setErr(error);
    }
  };

  return (
    <SafeAreaView backgroundColor="white" style={{ height: "100%" }}>
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
          borderWidth: 1,
          marginHorizontal: 20,
          borderRadius: 10,
          padding: 12,
        }}
      >
        <Text style={{ fontSize: 30 }}>Enter location details</Text>

        {/* Text Input section */}
        <View
          style={{
            gap: 16,
            marginHorizontal: 20,
            marginTop: 30,
            height: "75%",
          }}
        >
          <View style={{ gap: 5 }}>
            <Text>Shop Name</Text>
            <TextInput
              value={shop_name}
              style={{
                width: "100%",
                borderWidth: 1,
                borderRadius: 5,
                padding: 5,
                paddingHorizontal: 10,
              }}
              onChangeText={setShopName}
              placeholder="Enter shop name..."
            />
            {err.shop_name && (
              <Text style={{ color: "red", fontSize: 10 }}>
                * Enter shop's name
              </Text>
            )}
          </View>

          <View style={{ gap: 5 }}>
            <Text>Address</Text>
            <TextInput
              value={addr}
              style={{
                width: "100%",
                padding: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 5,
              }}
              onChangeText={setAddress}
              placeholder="Address"
            />
            {err.address && (
              <Text style={{ color: "red", fontSize: 10 }}>
                * Enter the address
              </Text>
            )}
          </View>

          <View style={{ gap: 5 }}>
            <Text>City</Text>
            <TextInput
              value={city}
              style={{
                width: "100%",
                padding: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 5,
              }}
              onChangeText={setCity}
              placeholder="City"
            />
            {err.city && (
              <Text style={{ color: "red", fontSize: 10 }}>
                * Enter the city
              </Text>
            )}
          </View>

          <View style={{ gap: 5 }}>
            <Text>State</Text>
            <TextInput
              value={ste}
              style={{
                width: "100%",
                padding: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 5,
              }}
              onChangeText={setState}
              placeholder="State"
            />
            {err.state && (
              <Text style={{ color: "red", fontSize: 10 }}>
                * Enter the state
              </Text>
            )}
          </View>

          <View style={{ gap: 5 }}>
            <Text>Country</Text>
            <TextInput
              value={country}
              style={{
                width: "100%",
                padding: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 5,
              }}
              onChangeText={setCountry}
              placeholder="Country"
            />
            {err.country && (
              <Text style={{ color: "red", fontSize: 10 }}>
                * Enter the country
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
                backgroundColor: "#d63c31",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                marginTop: 12,
              }}
              onPress={() => handleNext()}
            >
              <Text style={{ color: "white" }}>Go to Next Step</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
