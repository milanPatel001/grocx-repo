import { Tabs } from "expo-router/tabs";
import { HomeIcon, StarIcon, BookOpenIcon } from "react-native-heroicons/solid";
import { DataProvider } from "../../DataContext";

export default function Layout() {
  return (
    <DataProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="(stack)"
          options={{
            title: "Home",
            tabBarIcon: () => <HomeIcon size={30} style={{ color: "black" }} />,
          }}
        />
        <Tabs.Screen
          name="favourites"
          options={{
            title: "Favourites",
            tabBarIcon: () => <StarIcon size={30} style={{ color: "gold" }} />,
          }}
        />
      </Tabs>
    </DataProvider>
  );
}
