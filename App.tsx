import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, Platform, StatusBar, View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Home from "./screens/Home";
import Draw from "./screens/Draw";
import Guess from "./screens/Guess";
import Landing from "./screens/Landing";
import Menu from "./screens/Menu";
import Leaderboard from "./screens/Leaderboard";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import COLORS from "./constants/colors";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded] = Font.useFonts({
    "TitanOne-Regular": require("./assets/fonts/TitanOne-Regular.ttf"),
    "Kanit-Black": require("./assets/fonts/Kanit-Black.ttf"),
    "Kanit-BlackItalic": require("./assets/fonts/Kanit-BlackItalic.ttf"),
    "Kanit-Bold": require("./assets/fonts/Kanit-Bold.ttf"),
    "Kanit-BoldItalic": require("./assets/fonts/Kanit-BoldItalic.ttf"),
    "Kanit-ExtraBold": require("./assets/fonts/Kanit-ExtraBold.ttf"),
    "Kanit-ExtraLight": require("./assets/fonts/Kanit-ExtraLight.ttf"),
    "Kanit-Light": require("./assets/fonts/Kanit-Light.ttf"),
    "Kanit-Medium": require("./assets/fonts/Kanit-Medium.ttf"),
    "Kanit-Regular": require("./assets/fonts/Kanit-Regular.ttf"),
    "Kanit-SemiBold": require("./assets/fonts/Kanit-SemiBold.ttf"),
    "Kanit-SemiBoldItalic": require("./assets/fonts/Kanit-SemiBoldItalic.ttf"),
    "Kanit-Thin": require("./assets/fonts/Kanit-Thin.ttf"),
  });

  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(COLORS.secondary);
  }

  if (Platform.OS === "ios") {
    StatusBar.setBarStyle("light-content");
  }

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    const hideSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    hideSplash();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log("isLoaded:", isLoaded);

  if (!isLoaded) {
    return null;
  }

  return (
    <NavigationContainer
      style={{
        height: "100%",
        flex: 1,
        flexDirection: "column",
        backgroundColor: COLORS.secondary,
      }}>
      <SafeAreaView
        onLayout={onLayoutRootView}
        style={{
          paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
          flex: 1,
          backgroundColor: COLORS.secondary,
        }}>
        {/* <AudioPlayer source={require("./assets/music/music01.mp3")} />*/}
        <View
          style={{
            backgroundColor: COLORS.secondary,
            flex: 1,
            position: "relative",
            width: "100%",
            maxWidth: 600,
            marginHorizontal: "auto",
          }}>
          <View
            style={{
              height: "auto",
              flex: 1,
              position: "relative",
              width: "100%",
              backgroundColor: "white",
            }}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerBackVisible: false,
                animation: "slide_from_right",
              }}>
              <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Leaderboard"
                component={Leaderboard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Draw"
                component={Draw}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Guess"
                component={Guess}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Menu"
                component={Menu}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Landing"
                component={Landing}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </View>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
