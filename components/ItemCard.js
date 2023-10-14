import { useNavigation, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";

export default function ItemCard({ item }) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/item/[info]", params: { info: item.id } })
      }
    >
      <View style={styles.cardContainer}>
        {/* Top Section - Cover Image */}
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

        {/* Bottom Section - Text */}
        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 15,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {item.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 200,
    height: 150,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    marginVertical: 10,
    zIndex: 30,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.2)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  coverImageContainer: {
    height: 120,
    width: "100%",
  },
  coverImage: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

/*
    <View style={styles.itemCard}>
      <View
        style={{
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.17,
          shadowRadius: 3.05,
          elevation: 4,
        }}
      >
        <View style={styles.imageView}>
          <Image
            source={{
              uri: "https://reactnative.dev/docs/assets/p_cat2.png",
            }}
            style={{ height: "100%", width: "100%" }}
          />
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 15,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Tampico Orange Drink
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemCard: {
    flex: 1,
    gap: 5,
    width: 180,
    height: 150,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "grey",
    position: "relative",
  },
  imageView: {
    borderRadius: 20,
    boxShadow: 1,
    position: "relative",
    height: 100,
    width: "100%",
  },
});


shadowColor: "#000000",
shadowOffset: {
  width: 0,
  height: 3,
},
shadowOpacity:  0.17,
shadowRadius: 3.05,
elevation: 4
*/
