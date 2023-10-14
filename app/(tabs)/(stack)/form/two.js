import { useEffect, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import {
  collection,
  query,
  where,
  runTransaction,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../../../../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function AddFormTwo() {
  const [loc, setLoc] = useState({ shop_name: "None" });
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [shop_name, setShopName] = useState("");
  const [ste, setState] = useState("");
  const [addr, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("Select a date");

  const [err, setErr] = useState({
    city: false,
    state: false,
    country: false,
    address: false,
    shop_name: false,
    price: false,
    date: false,
  });

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const {
    updateLocation,
    updateItem,
    state,
    updatePrices,
    updateCategories,
    updateImage,
  } = useFormData();
  const router = useRouter();

  async function uploadImageAsync(uri) {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const storageRef = ref(storage, "images/" + state.item.id);
    await uploadBytes(storageRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(storageRef);
  }

  const handleDBCalls = async () => {
    //1. If there's no item update, 4 calls:
    //                         0. Upload image to cloud and return reference to img field and then proceed
    //                         1. item field creation 2. location field creation 3. add prices and date
    //                         and have to create last_updated in location creation field
    //2. If there's an item update, 2 cases:
    //                         1. No loc update -> 2 calls: 1. loc field creatino 2. add prices and date
    //                         2. loc update -> 2 calls: add prices and date and have to change last_updated
    //Extra calls:
    //1. If there's no loc update, (regardless of item update): create location fields in location collection
    //2. If there's no item update, create item field in search collection

    const priceRef = doc(
      collection(
        db,
        "items",
        state.item.id,
        "location",
        state.location.id,
        "prices"
      )
    );
    const locRef = doc(
      db,
      "items",
      state.item.id,
      "location",
      state.location.id
    );
    const itemRef = doc(db, "items", state.item.id);
    const searchLocRef = doc(db, "locations", state.location.id);

    const searchLocObj = state.location;
    const locObj = {
      ...state.location,
      last_updated: [Timestamp.fromDate(date), Number(price)],
    };
    const priceObj = {
      date: Timestamp.fromDate(date),
      price: Number(price),
    };

    if (state.item.update) {
      // *************** UPDATING AN ITEM ***************************

      runTransaction(db, async (transaction) => {
        if (state.location.update) {
          // ******************** UPDATING LOCATION ************************

          const locDoc = await transaction.get(locRef);
          if (!locDoc.exists) throw "Document does not exist";

          const last_updated = locDoc.data().last_updated;
          const timestamp = Timestamp.fromDate(date);

          if (last_updated[0].seconds < timestamp.seconds) {
            transaction.update(locRef, {
              last_updated: [timestamp, Number(price)],
            });
          }
        } else if (!state.location.update) {
          // ******************** CREATING LOCATION ************************

          transaction.set(locRef, locObj);
          transaction.set(searchLocRef, searchLocObj);
        }

        transaction.set(priceRef, priceObj);
      })
        .then(() => {
          updateItem(null);
          updateLocation(null);
          updatePrices(null);
          updateCategories(null);
          updateImage(null);
        })
        .catch((ex) => console.error(ex));
    } else if (!state.item.update) {
      // *********** CREATING NEW ITEM *************
      const downloadImgUrl = await uploadImageAsync(state.item.img);

      const searchRef = doc(db, "search", state.item.id);
      const searchObj = state.item;

      const itemObj = state.item;
      itemObj.img = downloadImgUrl;

      const batch = writeBatch(db);

      batch.set(itemRef, itemObj);
      batch.set(locRef, locObj);
      batch.set(priceRef, priceObj);
      batch.set(searchRef, searchObj);

      if (!state.location.update) {
        // ********** CREATING LOCATION in locations collection ****************
        batch.set(searchLocRef, searchLocObj);
      }

      batch
        .commit()
        .then(() => {
          // add item to global home data
          // add item to search item data

          updateItem(null);
          updateLocation(null);
          updatePrices(null);
          updateCategories(null);
          updateImage(null);
        })
        .catch((ex) => console.error(ex));
    }
  };

  const handlePriceChange = (text) => {
    if (/^[0-9.]*$/.test(text)) {
      setPrice(text);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    //console.log(date.toDateString());
    setDate(date);

    //console.log(Timestamp.fromDate(date));
    hideDatePicker();
  };

  useEffect(() => {
    if (state.location) {
      //console.log(state.item);
      setLoc(state.location);
    }
  }, [state.location]);

  const handleNext = () => {
    //input validation
    const error = {
      shop_name: false,
      address: false,
      city: false,
      country: false,
      state: false,
      price: false,
      date: false,
    };

    if (!state.location || loc.shop_name === "None") {
      // got no location using location modal
      if (
        shop_name.length > 0 &&
        addr.length > 0 &&
        city.length > 0 &&
        country.length > 0 &&
        ste.length > 0 &&
        typeof date !== "string" &&
        price.length > 0
      ) {
        const getId = () => {
          const arr1 = shop_name.split(" ");
          const arr2 = addr.split(" ");
          let id = "";

          for (let i = 0; i < arr1.length; i++) {
            id = id + arr1[i].substring(0, 3).toUpperCase();
          }

          id += arr2[0].toUpperCase() + arr2[arr2.length - 1].toUpperCase();

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

        handleDBCalls();
      } else {
        // we don't have location and also not date or price

        if (shop_name.length === 0) error.shop_name = true;
        if (addr.length === 0) error.address = true;
        if (city.length === 0) error.city = true;
        if (country.length === 0) error.country = true;
        if (ste.length === 0) error.state = true;
        if (typeof date === "string") error.date = true;
        if (price.length === 0) error.price = true;

        setErr(error);
      }
    } else {
      // got location using location modal
      if (typeof date !== "string" && price.length > 0) {
        handleDBCalls();
      } else {
        // we have location but not date or price
        if (typeof date === "string") error.date = true;
        if (price.length === 0) error.price = true;
        setErr(error);
      }
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView>
        <View
          style={{
            marginHorizontal: 20,
            gap: 25,
            marginVertical: 20,
            height: "100%",
          }}
        >
          <ArrowLeftIcon
            size={30}
            color="black"
            onPress={() => router.back()}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text style={{ fontWeight: 500, fontSize: 20 }}>Location: </Text>

            <View
              style={{
                height: 30,
                borderWidth: 1,
                borderRadius: 10,
                elevated: 10,
                alignItems: "center",
                justifyContent: "center",
                width: "60%",
              }}
            >
              <TouchableOpacity
                style={{}}
                onPress={() => router.push("/form/locationModal")}
              >
                <Text>{loc.shop_name}</Text>
              </TouchableOpacity>
            </View>
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
              <Text style={{ color: "white" }}>Next</Text>
            </TouchableOpacity>
          </View>

          {/* Heading */}
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Text>------------------------ OR -----------------------</Text>
            <Text>Enter details below if item not found in the above list</Text>
          </View>

          {/* Text Input section */}

          <View style={{ gap: 20 }}>
            <View>
              <TextInput
                value={shop_name}
                style={{
                  width: "50%",
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

            <View>
              <TextInput
                value={addr}
                style={{
                  width: "30%",
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

            <View>
              <TextInput
                value={city}
                style={{
                  width: "30%",
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

            <View>
              <TextInput
                value={ste}
                style={{
                  width: "30%",
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

            <View>
              <TextInput
                value={country}
                style={{
                  width: "30%",
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
          </View>

          {/* Price addition */}
          <View style={{ gap: 5 }}>
            <Text style={{ color: err.price ? "red" : "black" }}>
              {err.price ? "*" : ""} Enter Price
            </Text>
            <TextInput
              value={price}
              style={{
                width: "50%",
                padding: 5,
                paddingHorizontal: 10,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: err.price ? "red" : "black",
              }}
              onChangeText={(text) => handlePriceChange(text)}
              placeholder="Enter Price (in dollars)"
            />
          </View>

          <View style={{ gap: 10, alignItems: "center" }}>
            <View
              style={{
                borderWidth: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                paddingHorizontal: 20,
                borderColor: err.date ? "red" : "black",
              }}
            >
              <Text style={{ color: err.date ? "red" : "black" }}>
                {typeof date === "string" ? date : date?.toDateString()}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "blue",
                padding: 10,
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
            >
              <TouchableOpacity onPress={showDatePicker}>
                <Text style={{ color: "white" }}>Show Date Picker</Text>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
