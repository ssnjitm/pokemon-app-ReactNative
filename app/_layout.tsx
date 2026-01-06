import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
      <Stack.Screen 
      name="index"
      options={
        {
          title:"Home",
          headerBackButtonDisplayMode:"minimal",
        }
      }

      />
      <Stack.Screen 
      name="details" 
      options={
        {
          title:"Details"
        }
      }
      />

  </Stack >;
}
