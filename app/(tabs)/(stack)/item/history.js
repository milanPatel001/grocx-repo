import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import ShopTable from "../../../../components/ShopTable";
import { LineChart } from "react-native-gifted-charts";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { StarIcon, ArrowLeftIcon } from "react-native-heroicons/outline";
import { StarIcon as Star } from "react-native-heroicons/solid";

export default function ItemHistory() {
  const params = useLocalSearchParams();

  const [data, setData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [isFav, setisFav] = useState(false);

  const getAllData = async () => {
    // const querySnapshot = await getDocs(
    //   collection(db, "items", params.info, "location", params.id, "prices")
    // );

    const ref = collection(
      db,
      "items",
      params.info,
      "location",
      params.id,
      "prices"
    );
    const q = query(ref, orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);

    const d = [];
    const b = [];

    querySnapshot.forEach((doc) => {
      d.push({ id: doc.id, ...doc.data() });
      b.push({
        value: doc.data().price,
        label: new Date(doc.data().date.seconds * 1000).toDateString(),
      });
    });

    //console.log(d);
    setData(d);
    setBarData(b);
  };

  useEffect(() => {
    if (data.length == 0) {
      getAllData();
    }
  }, []);

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: "white", height: "100%" }}>
        <ScrollView>
          <TouchableOpacity
            style={{ marginLeft: 15, marginBottom: 15, marginTop: 5 }}
            onPress={() => router.back()}
          >
            <ArrowLeftIcon size={30} color="black" />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 40, flex: 0.8, paddingLeft: 15 }}>
              Price History
            </Text>

            <View
              style={{
                flex: 0.2,
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
                justifyContent: "flex-end",
                paddingRight: 20,
              }}
            ></View>
          </View>

          {/* General Info */}
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ fontSize: 20, fontFamily: "serif" }}>
              {params.shop_name}
            </Text>
            <Text style={{ fontSize: 20, fontFamily: "serif" }}>
              {params.address}, {params.city}, {params.country}
            </Text>
          </View>

          {/* Graph */}
          <View style={styles.graphContainer}>
            {barData.length > 1 && (
              <LineChart
                areaChart
                spacing={150}
                initialSpacing={50}
                endSpacing={150}
                startFillColor="skyblue"
                startOpacity={0.8}
                endOpacity={0.3}
                data={barData}
              />
            )}
          </View>
          <View style={styles.table}>
            <View
              style={{
                flexDirection: "row",
                height: 60,
                borderBottomWidth: 1,
                borderBottomColor: "grey",
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  flex: 0.6,

                  justifyContent: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>Date</Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 20 }}>Price</Text>
                <Text style={{}}>(Last Updated)</Text>
              </View>
            </View>

            <ShopTable data={data} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  table: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    paddingBottom: 80,
  },
  graphContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 0,
  },
});
