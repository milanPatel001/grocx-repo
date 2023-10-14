import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Table({ data, info }) {
  const router = useRouter();

  return (
    <View>
      {data.length > 0 &&
        data.map((i) => (
          <Pressable
            key={i.id}
            style={{
              flexDirection: "row",
              height: 50,
              borderBottomColor: "grey",
              paddingHorizontal: 10,
              alignItems: "center",
              marginVertical: 10,
            }}
            onPress={() =>
              router.push({
                pathname: "/item/history",
                params: {
                  id: i.id,
                  info,
                  address: i.address,
                  city: i.city,
                  country: i.country,
                  shop_name: i.shop_name,
                },
              })
            }
          >
            <View
              style={{
                flex: 0.6,
              }}
            >
              <Text style={{ fontSize: 20 }}>{i.shop_name}</Text>
            </View>
            <View
              style={{
                flex: 0.4,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 20 }}>${i.last_updated[1]}</Text>
              <Text>
                ({new Date(i.last_updated[0].seconds * 1000).toDateString()})
              </Text>
            </View>
          </Pressable>
        ))}
    </View>
  );
}
