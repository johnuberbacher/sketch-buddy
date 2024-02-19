import React, { useCallback, useEffect } from "react";
import { SafeAreaView, Platform, StatusBar, View } from "react-native";
import Canvas from "./components/Canvas";
import LetterBoard from "./components/LetterBoard";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import Home from "./screens/Home";
import Draw from "./screens/Draw";
import Guess from "./screens/Guess";
import Landing from "./screens/Landing";
import Type from "./screens/Type";
import Menu from "./screens/Menu";
import Nav from "./components/Nav";
import AudioPlayer from "./util/AudioPlayer";
import { NavigationContainer } from "@react-navigation/native";
import { TransitionPresets } from "@react-navigation/stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import COLORS from "./constants/colors";
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'

const Stack = createNativeStackNavigator();

const App = () => {
  const [session, setSession] = useState<Session | null>(null)

  const [isLoaded] = Font.useFonts({
    "TitanOne-Regular": require("./assets/fonts/TitanOne-Regular.ttf"),
  });

  if (Platform.OS === "android") {
    StatusBar.setBackgroundColor(COLORS.primary); 
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

  if (!isLoaded) {
    return null;
  }
  

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  console.log("isLoaded:", isLoaded);

  return (
    <NavigationContainer
      style={{
        height: "100%",
        flex: 1,
        flexdirection: "column",
      }}>
      <SafeAreaView
        onLayout={onLayoutRootView}
        style={{
          paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
          flex: 1,
        }}>
        <AudioPlayer source={require("./assets/music/music01.mp3")} />
        <View style={{ flex: 1, position: "relative", maxWidth: 600 }}>
          <Stack.Navigator
            screenOptions={{
              animation: 'slide_from_right',
            }}>
            <Stack.Screen name="Landing" component={Landing} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Draw" component={Draw} />
            <Stack.Screen name="Guess" component={Guess} />
            <Stack.Screen name="Menu" component={Menu} />
            <Stack.Screen name="Type" component={Type} />
          </Stack.Navigator>
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
