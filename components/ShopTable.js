import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function ShopTable({ data }) {
  return (
    <View>
      {data.length > 0 &&
        data.map((i) => (
          <View
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
              <Text style={{ fontSize: 20 }}>
                {" "}
                {new Date(i.date.seconds * 1000).toDateString()}
              </Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>${i.price}</Text>
            </View>
          </View>
        ))}
    </View>
  );
}
