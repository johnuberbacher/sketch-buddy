import {
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
  StyleSheet,
} from "react-native";
import Button from "../components/Button";
import { useLayoutEffect, useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

const Landing = (props) => {
  const [session, setSession] = useState<Session | null>(null);
  const image = { uri: "../assets/bg.png" };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View>
        <Text>Stuff here</Text>
      </View>
      <ImageBackground blurRadius={5} resizeMode="cover">
        <View style={styles.overlayInner}>
          <Text selectable={false} style={styles.overlayTitle}>
            Play Now!
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
            }}>
            <View
              style={{
                width: "100%",
                flex: 1,
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "strech",
                gap: 0,
              }}>
              <View
                style={{ width: "100%", flexDirection: "row", marginTop: 30 }}>
                <Button
                  title="Github Login"
                  onPress={() => {
                    navigation.navigate("Home");
                  }}
                />
              </View>
              <View
                style={{ width: "100%", flexDirection: "row", marginTop: 30 }}>
                <Button title="Quit" />
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          marginBottom: 20,
        }}>
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Text>By tapping Sign In, you agree to our </Text>
          <TouchableOpacity>
            <Text
              style={{
                textDecorationStyle: "solid",
                textDecorationLine: "underline",
              }}
              onpress={() => Linking.openURL("https://www.google.com")}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text> and </Text>
          <TouchableOpacity>
            <Text
              style={{
                textDecorationStyle: "solid",
                textDecorationLine: "underline",
              }}
              onpress={() => Linking.openURL("https://www.google.com")}>
              Privacy Policy.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 40,
    padding: 20,
    backgroundColor: COLORS.secondary,
  },
  overlayInner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    borderStyle: "solid",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 0,
  },
  overlayTitle: {
    width: "100%",
    color: "white",
    fontSize: 30,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 2,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 20,
  },
});

export default Landing;
