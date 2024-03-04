import {
  TouchableOpacity,
  Alert,
  View,
  ImageBackground,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import { useNavigation } from "@react-navigation/native";
import TextField from "../components/input/Text";
import Loading from "../components/Loading";
import Verification from "../components/input/Verification";

const Landing = () => {
  const navigation = useNavigation();
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [verficationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [awaitVerification, setAwaitVerification] = useState(false);

  async function resetAuth() {
    setEmail("");
    setVerificationCode("");
    setAwaitVerification(false);
  }

  async function verifyWithEmail() {
    setLoading(true);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: verficationCode,
      type: "email",
    });

    if (error) Alert.alert(error.message);

    setLoading(false);
  }

  async function signInWithEmail() {
    setLoading(true);

    const userColors = ["#f86134", "#ade053", "#0e96c8", "#ffcd3a"];

    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
        data: {
          username: `user#${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`,
          avatar_url: null,
          color: userColors[Math.floor(Math.random() * userColors.length)],
        },
      },
    });

    if (error) Alert.alert(error.message);

    setLoading(false);
    setAwaitVerification(true);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      {loading && <Loading />}
      <ScrollView
        overScrollMode="never"
        alwaysBounceVertical={false}
        contentContainerStyle={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            maxWidth: 500,
            marginHorizontal: "auto",
            gap: 40,
            padding: 20,
          }}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}>
            <View
              style={{
                paddingHorizontal: 20,
                width: "100%",
                gap: 20,
              }}>
              <ImageBackground
                style={{
                  aspectRatio: 2 / 1,
                  width: "100%",
                  height: "auto",
                }}
                source={require("../../assets/logo.png")}
                resizeMode={"contain"}></ImageBackground>
              <ImageBackground
                style={{
                  marginBottom: -40,
                  aspectRatio: 2 / 1,
                  width: "100%",
                  height: "auto",
                }}
                source={require("../../assets/players.png")}
                resizeMode={"contain"}></ImageBackground>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}>
              <ImageBackground
                style={{
                  flexDirection: "row",
                }}
                blurRadius={5}
                resizeMode="cover">
                <View style={styles.overlayInner}>
                  <>
                    {!awaitVerification ? (
                      <>
                        <Text
                          style={{
                            width: "100%",
                            fontSize: 18,
                            fontFamily: "Kanit-Regular",
                            color: "rgba(0,0,0,0.5)",
                            textAlign: "center",
                            paddingHorizontal: 5,
                          }}>
                          Enter your email address to get sent a verfication
                          code
                        </Text>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                          }}>
                          <TextField
                            value={email}
                            placeholder={"Email Address"}
                            onChangeText={(text) => {
                              setEmail(text);
                            }}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            gap: 10,
                          }}>
                          <Button
                            title="Continue"
                            color="primary"
                            onPress={() => signInWithEmail()}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        <Text
                          style={{
                            width: "100%",
                            fontSize: 18,
                            fontFamily: "Kanit-Regular",
                            color: "rgba(0,0,0,0.5)",
                            textAlign: "center",
                            paddingHorizontal: 5,
                          }}>
                          We have sent a verification code to
                          <Text style={{ fontFamily: "Kanit-SemiBold" }}>
                            {" "}
                            {email}
                          </Text>
                        </Text>

                        <Verification
                          propValue={verficationCode}
                          setVerificationCode={setVerificationCode}
                        />
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            gap: 10,
                          }}>
                          <Button
                            title="Login"
                            color="primary"
                            onPress={() => verifyWithEmail()}
                          />
                        </View>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            gap: 10,
                          }}>
                          <Button
                            title="Try again"
                            color="secondary"
                            onPress={() => resetAuth()}
                          />
                        </View>
                      </>
                    )}
                  </>
                </View>
              </ImageBackground>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 40,
            }}>
            <Text>By tapping Continue, you agree to our </Text>
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
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    gap: 15,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    borderStyle: "solid",
    borderRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 2,
  },
});

export default Landing;
