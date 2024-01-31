import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useData } from "../DataContext";
import { useRouter } from "expo-router";

export default function RecentlyViewedSection() {
  const { state } = useData();
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        {state.recentData.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/item/[info]",
                params: { info: item.id },
              })
            }
          >
            <View style={styles.coverImageContainer}>
              <Image
                source={{
                  uri: item.img,
                }}
                style={{
                  height: "100%",
                  width: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>

            <Text style={{ textAlign: "center", fontWeight: "300" }}>
              {item.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  coverImageContainer: {
    height: 120,
    width: "100%",
  },
  card: {
    width: 180,
    alignItems: "center",
    gap: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 5,
  },
});
