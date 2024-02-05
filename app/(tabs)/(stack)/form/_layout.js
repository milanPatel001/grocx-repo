import { Stack } from "expo-router/stack";
import { FormProvider } from "../../../../FormContext";

export default function Layout() {
  return (
    <FormProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="one"
          options={{
            // Hide the header for all other routes.
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="itemModal"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Select an item",
          }}
        />
        <Stack.Screen
          name="locationModal"
          options={{
            presentation: "modal",
            headerShown: true,
            headerTitle: "Select a location",
          }}
        />
      </Stack>
    </FormProvider>
  );
}
