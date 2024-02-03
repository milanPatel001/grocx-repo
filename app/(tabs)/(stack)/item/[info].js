import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BarChart } from "react-native-gifted-charts";
import {
  ArrowLeftIcon,
  StarIcon,
  ArrowSmallUpIcon,
  ArrowSmallDownIcon,
  MinusIcon,
} from "react-native-heroicons/outline";
import { StarIcon as Star } from "react-native-heroicons/solid";
import Navbar from "../../../../components/Navbar";
import { useEffect, useState } from "react";
import { auth, db } from "../../../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Table from "../../../../components/Table";
import { useData } from "../../../../DataContext";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  categoryColor,
  getItemInfo,
  handleFavoritesAddition,
} from "../../../../utils";

export default function ItemScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const authState = useAuthState(auth);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({});
  const [barData, setBarData] = useState([]);
  const [isFav, setisFav] = useState(false);
  const [currentSort, setSort] = useState({
    sort: "alphabetical",
    order: "asc",
  });

  const { state, updateFavData } = useData();

  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const barData1 = [
    {
      value: 20,
      dataPointText: "0",
      label: "Aldi 289 85th Ave",
      frontColor: "#4ABFF4",
    },
    { value: 10, dataPointText: "10", label: "2", frontColor: "red" },
    { value: 8, dataPointText: "8", label: "3" },
    { value: 58, dataPointText: "58", label: "7" },
    { value: 56, dataPointText: "56", label: "8" },
    { value: 78, dataPointText: "78", label: "9" },
    { value: 74, dataPointText: "74", label: "11" },
    { value: 98, dataPointText: "98", label: "12" },
  ];

  useEffect(() => {
    if (data.length === 0) {
      getItemInfo(setData, setBarData, params);
    }
  }, []);

  useEffect(() => {
    if (state.homeData) {
      const found = state.homeData.find((item) => item.id === params.info);
      if (found) {
        setMeta(found);
      }
    }
  }, [state.homeData]);

  useEffect(() => {
    if (state.favData) {
      const found = state.favData.find((item) => item.id === params.info);

      setisFav(found);
    }
  }, [state.favData]);

  useEffect(() => {
    //logic for sorting data
    const newData = [...data];

    if (currentSort.sort === "alphabetical") {
      if (currentSort.order === "asc") {
        newData.sort((a, b) => a.shop_name.localeCompare(b.shop_name));
      } else {
        newData.sort((a, b) => b.shop_name.localeCompare(a.shop_name));
      }
    } else if (currentSort.sort === "price") {
      if (currentSort.order === "asc") {
        newData.sort((a, b) => a.last_updated[1] - b.last_updated[1]);
      } else {
        newData.sort((a, b) => b.last_updated[1] - a.last_updated[1]);
      }
    }

    setData(newData);
  }, [currentSort]);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <Navbar labelStatus={false}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon size={40} color={"black"} />
        </TouchableOpacity>
      </Navbar>

      <View
        style={{
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <ScrollView>
          {/* Image */}

          <View style={styles.coverImageContainer}>
            <Image
              source={{
                uri: meta?.img, // "https://www.kroger.com/product/images/large/front/0009518801128",
              }}
              style={{
                height: 230,
                width: "90%",
                resizeMode: "contain",
              }}
            />
            <View style={{ position: "absolute", right: 30, top: 10 }}>
              <TouchableOpacity
                onPress={() =>
                  handleFavoritesAddition(
                    isFav,
                    state,
                    authState,
                    params,
                    meta,
                    updateFavData
                  )
                }
              >
                {!isFav ? (
                  <StarIcon size={35} color="black" />
                ) : (
                  <Star size={35} color="gold" stroke="red" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.productName}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 30,
              }}
            >
              {meta?.name}
            </Text>
          </View>

          {/* General Info */}
          <View style={styles.generalInfo}>
            <View
              style={{ flex: 0.5, borderRightWidth: 1, borderColor: "black" }}
            >
              <View style={{ paddingVertical: 10 }}>
                <Text
                  style={{ fontWeight: 400, fontSize: 15, marginBottom: 2 }}
                >
                  Categories{" "}
                </Text>
                {meta?.category?.map((cat) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                    key={cat}
                  >
                    <Text
                      style={{
                        fontWeight: 400,
                        color: "white",
                        backgroundColor: categoryColor(cat),
                        borderRadius: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 2,
                        fontWeight: "600",
                      }}
                    >
                      {cat.toUpperCase()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ flex: 0.5, paddingLeft: 10 }}>
              <Text style={{ fontWeight: "400", fontSize: 15 }}>Weight: </Text>

              <Text style={{ fontWeight: "600", fontSize: 15 }}>
                {meta?.weight}
              </Text>
            </View>
          </View>

          <View style={styles.divider}></View>

          {/* Graph */}
          {barData.length > 1 && (
            <>
              <Text style={{ marginLeft: 20, fontSize: 30 }}>Price Graph</Text>
              <View style={styles.graphContainer}>
                <BarChart
                  frontColor={"#6F2DA8"}
                  barWidth={25}
                  spacing={40}
                  data={barData}
                  barBorderRadius={4}
                  yAxisTextStyle={{ fontWeight: "600" }}
                />
              </View>
            </>
          )}

          {/* Table */}
          {/* <Text style={{ marginLeft: 20, fontSize: 30, marginTop: 20 }}>
            Price Table
          </Text> */}
          <View style={styles.table}>
            <View style={styles.tableLeft}>
              <View
                style={{
                  flex: 0.6,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>Shop Name</Text>
                  {currentSort.sort === "alphabetical" ? (
                    currentSort.order === "asc" ? (
                      <ArrowSmallUpIcon
                        size={20}
                        color="red"
                        onPress={() =>
                          setSort({ sort: "alphabetical", order: "desc" })
                        }
                      />
                    ) : (
                      <ArrowSmallDownIcon
                        size={20}
                        color="red"
                        onPress={() =>
                          setSort({ sort: "alphabetical", order: "asc" })
                        }
                      />
                    )
                  ) : (
                    <MinusIcon
                      size={20}
                      color="gray"
                      onPress={() =>
                        setSort({ sort: "alphabetical", order: "asc" })
                      }
                    />
                  )}
                </View>
              </View>
              <View
                style={{
                  flex: 0.4,
                  alignItems: "center",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Text style={{ fontSize: 20 }}>Price</Text>

                  {currentSort.sort === "price" ? (
                    currentSort.order === "asc" ? (
                      <ArrowSmallUpIcon
                        size={20}
                        color="red"
                        onPress={() =>
                          setSort({ sort: "price", order: "desc" })
                        }
                      />
                    ) : (
                      <ArrowSmallDownIcon
                        size={20}
                        color="red"
                        onPress={() => setSort({ sort: "price", order: "asc" })}
                      />
                    )
                  ) : (
                    <MinusIcon
                      size={20}
                      color="gray"
                      onPress={() => setSort({ sort: "price", order: "asc" })}
                    />
                  )}
                </View>

                <Text style={{}}>(Last Updated)</Text>
              </View>
            </View>

            {/* Data */}

            <Table data={data} info={params.info} />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  coverImageContainer: {
    height: 270,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    borderRadius: 10,
    alignItems: "center",
  },
  graphContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  table: {
    marginTop: 10,
    marginHorizontal: 10,
    marginBottom: 200,
    borderRadius: 10,
    borderWidth: 1,
    paddingBottom: 15,
    flex: 1,
  },
  tableLeft: {
    flexDirection: "row",
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    paddingHorizontal: 10,
  },
  divider: {
    borderWidth: 0.5,
    borderColor: "#dfe3e6",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  generalInfo: {
    marginHorizontal: 20,
    marginVertical: 20,
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "black",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  productName: {
    justifyContent: "flex-start",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    gap: 10,
  },
});

/*
<Pressable
                key={i.id}
                style={{
                  flexDirection: "row",
                  height: 50,
                  borderBottomColor: "grey",
                  paddingHorizontal: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flex: 0.6,
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>
                    {i.shop_name}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, color: "white" }}>
                    ${i.last_updated[1]}
                  </Text>
                  <Text style={{ color: "white" }}>
                    ({new Date(i.last_updated[0].seconds * 1000).toDateString()}
                    )
                  </Text>
                </View>
              </Pressable>
*/

/*
No data
            {arr?.map((i) => (
              <Pressable
                key={i}
                onPress={() =>
                  router.push({ pathname: "/item/history", params: {id: i.id} })
                }
                style={{
                  flexDirection: "row",
                  height: 50,
                  borderBottomColor: "grey",
                  paddingHorizontal: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flex: 0.6,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>Aldi</Text>
                  <Text>289 85, NY, USA</Text>
                </View>
                <View
                  style={{
                    flex: 0.4,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 20 }}>$7.99</Text>
                  <Text style={{}}>(23 Aug )</Text>
                </View>
              </Pressable>
            ))}
*/
