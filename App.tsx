import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  StyleSheet,
  LogBox,
  ImageBackground,
  Touchable,
} from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./src/screens/Home";
import Draw from "./src/screens/Draw";
import Guess from "./src/screens/Guess";
import Landing from "./src/screens/Landing";
import Leaderboard from "./src/screens/Leaderboard";
import COLORS from "./src/constants/colors";
import AudioPlayer from "./src/util/AudioPlayer";
import { supabase } from "./src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

const App = () => {
  const [audioFilesLoaded, setAudioFilesLoaded] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [fontsLoaded] = useFonts({
    "Kanit-Black": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Black.ttf"),
    "Kanit-Bold": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Bold.ttf"),
    "Kanit-ExtraBold": require(/* webpackPreload: true */ "./assets/fonts/Kanit-ExtraBold.ttf"),
    "Kanit-Light": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Light.ttf"),
    "Kanit-Medium": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Medium.ttf"),
    "Kanit-Regular": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Regular.ttf"),
    "Kanit-SemiBold": require(/* webpackPreload: true */ "./assets/fonts/Kanit-SemiBold.ttf"),
    "Kanit-Thin": require(/* webpackPreload: true */ "./assets/fonts/Kanit-Thin.ttf"),
  });

  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor("transparent");
  }

  if (Platform.OS === "ios") {
    StatusBar.setBarStyle("light-content");
  }

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    const onAuthStateChanged = (_event, session) => {
      setSession(session);
    };

    const hideSplash = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    };

    supabase.auth.onAuthStateChange(onAuthStateChanged);

    fetchSession();
    hideSplash();
  }, []);

  const Stack = createNativeStackNavigator();
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && audioFilesLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, audioFilesLoaded]);

  if (!fontsLoaded || !audioFilesLoaded) {
    return null;
  }

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };
  return (
    <NavigationContainer theme={MyTheme} style={styles.container}>
      <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
        <StatusBar
          barStyle="dark-content"
          animated={true}
          backgroundColor={COLORS.secondary}
        />
        <View style={styles.mainContainer}>
          <ImageBackground
            source={require("./assets/bg.png")}
            resizeMode={"cover"}
            style={styles.innerContainer}>
            {session && session.user ? (
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "transparent",
                  },
                  headerShadowVisible: false,
                  cardStyle: {
                    backgroundColor: "transparent",
                  },
                  animation: "slide_from_right",
                }}>
                <Stack.Screen
                  name="Home"
                  component={Home}
                  initialParams={{
                    key: session.user.id,
                    session: session,
                  }}
                  options={{
                    headerStyle: {
                      backgroundColor: "transparent",
                    },
                    headerTitle: "",
                    headerLeft: () => (
                      <GestureHandlerRootView>
                        <TouchableOpacity
                          onPress={() => {
                            // Handle TouchableOpacity press
                            // props.navigation.setParams({ showModal: true });
                          }}>
                          <MaterialCommunityIcons
                            name="menu"
                            size={30}
                            color={COLORS.text}
                          />
                        </TouchableOpacity>
                      </GestureHandlerRootView>
                    ),
                  }}
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
                  name="Landing"
                  component={Landing}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Leaderboard"
                  component={Leaderboard}
                  initialParams={{
                    key: session.user.id,
                    session: session,
                  }}
                  options={{
                    headerStyle: {
                      backgroundColor: "transparent",
                    },
                    headerTitle: "",
                    headerLeft: () => (
                      <GestureHandlerRootView>
                        <TouchableOpacity
                          onPress={() => {
                            // Handle TouchableOpacity press
                            // props.navigation.setParams({ showModal: true });
                          }}>
                          <MaterialCommunityIcons
                            name="menu"
                            size={30}
                            color={COLORS.text}
                          />
                        </TouchableOpacity>
                      </GestureHandlerRootView>
                    ),
                  }}
                />
              </Stack.Navigator>
            ) : (
              <Landing />
            )}
          </ImageBackground>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingHorizontal: 20,
    marginHorizontal: 0,
  },
  container: {
    height: "100%",
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.secondary,
  },
  safeArea: {
    paddingTop: 0,
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  mainContainer: {
    backgroundColor: COLORS.secondary,
    flex: 1,
    position: "relative",
    width: "100%",
  },
  innerContainer: {
    height: "auto",
    flex: 1,
    position: "relative",
    width: "100%",
    backgroundColor: "white",
  },
});

export default App;
