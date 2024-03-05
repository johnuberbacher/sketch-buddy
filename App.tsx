import React, { useState, useCallback, useEffect } from "react";
import {
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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Home from "./src/screens/Home";
import Draw from "./src/screens/Draw";
import Guess from "./src/screens/Guess";
import Landing from "./src/screens/Landing";
import Leaderboard from "./src/screens/Leaderboard";
import COLORS from "./src/constants/colors";
import { supabase } from "./src/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { AudioProvider } from "./src/util/AudioContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const App: React.FC = () => {
  const [audioFilesLoaded, setAudioFilesLoaded] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
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
    <SafeAreaProvider>
      <NavigationContainer theme={MyTheme} style={styles.container}>
        <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
          <AudioProvider>
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
                      headerShown: false,
                      headerShadowVisible: false,
                      animation: "slide_from_right",
                    }}>
                    <Stack.Screen
                      name="Home"
                      component={Home}
                      initialParams={{
                        key: session.user.id,
                        session: session,
                      }}
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
                      options={{ headerShown: false }}
                    />
                  </Stack.Navigator>
                ) : (
                  <Landing />
                )}
              </ImageBackground>
            </View>
          </AudioProvider>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
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
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingTop: Platform.OS === "android" ? 0 : 0,
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
