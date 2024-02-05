import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFormData } from "../../../../FormContext";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import {
  collection,
  runTransaction,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db, storage } from "../../../../firebaseConfig";
import { uploadImageAsync } from "../../../../utils";

export default function Three() {
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("Not selected");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [err, setErr] = useState({
    date: false,
    price: false,
  });

  const router = useRouter();

  const [baseViewDimensions, setBaseViewDimensions] = useState({
    width: 0,
    height: 0,
  });

  const onBaseViewLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setBaseViewDimensions({ width, height });
  };

  const {
    state,
    updateItem,
    updateCategories,
    updateImage,
    updateLocation,
    updatePrices,
  } = useFormData();

  const handleNext = () => {
    const error = {
      price: false,
      date: false,
    };

    if (typeof date === "string") error.date = true;
    if (price.length === 0) error.price = true;

    if (typeof date !== "string" && price.length > 0) {
      handleDBCalls();
    } else {
      setErr(error);
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

  const handlePriceChange = (text) => {
    if (/^[0-9.]*$/.test(text)) {
      setPrice(text);
    }
  };

  const handleDBCalls = async () => {
    //1. If there's no item update, 4 calls:
    //                         0. Upload image to cloud and return reference to img field and then proceed
    //                         1. item field creation 2. location field creation 3. add prices and date
    //                         and have to create last_updated in location creation field
    //2. If there's an item update, 2 cases:
    //                         1. No loc update -> 2 calls: 1. loc field creation 2. add prices and date
    //                         2. loc update -> 2 calls: add prices and date and have to change last_updated
    //Extra calls:
    //1. If there's no loc update, (regardless of item update): create location fields in location collection
    //2. If there's no item update, create item field in search collection

    console.log("----------------ITEM---------------------");
    console.log(state.item);
    console.log("----------------Location---------------------");

    console.log(state.location);

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
          // ******************** UPDATING/CREATING LOCATION (pre existing loc)************************

          const locDoc = await transaction.get(locRef);
          if (!locDoc.data()) {
            transaction.set(locRef, locObj);
          } else {
            // location found in that item
            const last_updated = locDoc.data().last_updated;
            const timestamp = Timestamp.fromDate(date);

            if (last_updated[0].seconds < timestamp.seconds) {
              transaction.update(locRef, {
                last_updated: [timestamp, Number(price)],
              });
            }
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

          router.replace("/");
        })
        .catch((ex) => console.error(ex));
    } else if (!state.item.update) {
      // *********** CREATING NEW ITEM *************

      //console.error(state.item);

      const downloadImgUrl = await uploadImageAsync(
        state.item.img,
        state.item.id
      );

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

          router.replace("/");
        })
        .catch((ex) => console.error(ex));
    }
  };

  return (
    <SafeAreaView
      style={{ width: "100%", backgroundColor: "white", height: "100%" }}
    >
      <ArrowLeftIcon
        size={30}
        style={{
          marginHorizontal: 20,
          marginVertical: 10,
        }}
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
            Set Price & Date
          </Text>
          <View style={{ gap: 5 }}>
            <Text style={{ color: err.price ? "red" : "black" }}>
              {err.price ? "*" : ""} Enter Price
            </Text>
            <TextInput
              value={price}
              style={{
                ...styles.priceInput,
                borderColor: err.price ? "red" : "black",
              }}
              onChangeText={(text) => handlePriceChange(text)}
              placeholder="Enter Price (in dollars)"
            />
          </View>

          {/* Date section */}
          <View style={{ alignItems: "center", gap: 10, width: "100%" }}>
            <View
              style={{
                ...styles.date,
                borderColor: err.date ? "red" : "black",
              }}
            >
              <Text style={{ color: err.date ? "red" : "black" }}>
                {typeof date === "string" ? date : date?.toDateString()}
              </Text>
            </View>
            <View style={styles.datePicker}>
              <TouchableOpacity onPress={showDatePicker}>
                <Text style={{ color: "white" }}>Select Date</Text>
              </TouchableOpacity>
            </View>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={styles.submitButton}>
            <TouchableOpacity onPress={() => handleNext()}>
              <Text style={{ color: "white", fontSize: 20 }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 20,
    backgroundColor: "white",
  },
  priceInput: {
    width: "50%",
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  date: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 20,
    width: "50%",
  },
  datePicker: {
    backgroundColor: "black",
    padding: 10,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  submitButton: {
    width: "75%",
    height: 64,
    backgroundColor: "#d23c31",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    marginHorizontal: 20,
    marginTop: 32,
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
  },
  overlay2: {
    marginHorizontal: 20,
    marginTop: 32,
    position: "absolute",
    top: 5,
    right: 5,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "white",
  },
});
