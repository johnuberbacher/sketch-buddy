import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { supabase } from "../lib/supabase";
import React, { useState, useEffect, useLayoutEffect } from "react";
import Nav from "../components/Nav";
import NewButton from "../components/NewButton";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import ChooseWord from "../components/ChooseWord";
import Modal from "../components/Modal";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [remoteData, setRemoteData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [username, setUsername] = useState("juberbacher");
  const navigation = useNavigation();
  const [isChooseWordVisibleModal, setIsChooseWordModalVisible] =
    useState(false);

  const toggleChooseWordModalVisibility = () => {
    setIsChooseWordModalVisible(!isChooseWordVisibleModal);
  };

  // fetch games where user1 or user2 === username
  //

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // This block will run whenever sortedData is updated
    console.log("Sorted data updated:", sortedData);
  }, [sortedData]);

  async function getProfile() {
    try {
      setLoading(true);
      console.log("Fetching data from 'games' table...");

      const { data, error, status } = await supabase.from("games").select("*");

      if (error && status !== 406) {
        console.error("Error fetching data:", error);
        throw error;
      }

      if (data) {
        console.log("Data fetched successfully:", data);
        setRemoteData(data);

        const sortedRemoteData = [...data].sort((a, b) => {
          // Entries where 'turn' is equal to the specified username come first
          if (a.turn === username && b.turn !== username) {
            return -1;
          }
          if (a.turn !== username && b.turn === username) {
            return 1;
          }
          // For other cases or if both have the same 'turn', maintain the original order
          return 0;
        });

        setSortedData(sortedRemoteData);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in getProfile:", error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  // Call getProfile when the component mounts
  useEffect(() => {
    getProfile();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  return (
    <>
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.secondary,
            width: "100%",
            height: "100%",
            gap: 20,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator
            size="large"
            color="white"
            style={{ transform: [{ scale: 2 }] }}
          />
        </View>
      ) : (
        <>
          <Nav />
          {isChooseWordVisibleModal && (
            <Modal props="" title="Choose a word to draw">
              <ChooseWord onClose={() => toggleChooseWordModalVisibility()} />
            </Modal>
          )}
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.secondary,
              width: "100%",
              gap: 20,
              flexDirection: "column",
            }}>
            <View
              style={{
                paddingHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: 34,
                  fontFamily: "Kanit-Bold",
                  color: COLORS.text,
                }}>
                Let's Play
              </Text>
            </View>
            <View style={styles.menu}>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                  borderRadius: 30,
                  marginTop: -80,
                  marginBottom: 20,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 10,
                }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    gap: 20,
                  }}>
                  <ImageBackground
                    style={{ width: 50, height: 50 }}
                    source={require("../assets/s1.png")}
                    resizeMode={"contain"}></ImageBackground>
                  <View style={{ flexDirection: "column", paddingVertical: 5 }}>
                    <Text
                      style={{
                        fontFamily: "Kanit-Medium",
                        fontSize: 18,
                        opacity: 0.5,
                      }}>
                      Level
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Kanit-Bold",
                        color: COLORS.text,
                      }}>
                      1/100
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    height: "100%",
                    width: 2,
                    backgroundColor: "#000",
                    opacity: 0.05,
                  }}></View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 20,
                    gap: 20,
                  }}>
                  <ImageBackground
                    style={{ width: 50, height: 50, elevation: 5 }}
                    source={require("../assets/c.png")}
                    resizeMode={"contain"}></ImageBackground>
                  <View style={{ flexDirection: "column", paddingVertical: 5 }}>
                    <Text
                      style={{
                        fontFamily: "Kanit-Medium",
                        fontSize: 18,
                        opacity: 0.5,
                      }}>
                      Coins
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Kanit-Bold",
                        color: COLORS.text,
                      }}>
                      600
                    </Text>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: "Kanit-SemiBold",
                  color: COLORS.text,
                }}>
                My Games
              </Text>
              <ScrollView
                style={{ width: "100%" }}
                contentContainerStyle={{
                  width: "100%",
                  flexDirection: "column",
                  gap: 20,
                }}>
                {sortedData.map((game) => (
                  <View key={game.id} style={styles.menuInner}>
                    <View
                      style={{
                        width: "100%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        gap: 10,
                        flex: 1,
                      }}>
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          height: 60,
                          width: 60,
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                          borderRadius: 15,
                          opacity: 0.75,
                        }}>
                        <Text
                          style={{
                            fontSize: 8,
                            fontFamily: "Kanit-SemiBold",
                            color: COLORS.text,
                            marginBottom: -8,
                            marginTop: 4,
                          }}>
                          STREAK
                        </Text>
                        <Text
                          style={{
                            fontSize: 24,
                            fontFamily: "Kanit-SemiBold",
                            color: COLORS.text,
                          }}>
                          {game.streak}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: 60,
                        }}>
                        <Avatar />
                      </View>
                      <View
                        style={{
                          width: "100%",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "flex-start",
                          gap: 2,
                        }}>
                        <View
                          style={{
                            width: "100%",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: 10,
                          }}>
                          <Text selectable={false} style={styles.usernameTitle}>
                            {game.user1 === username ? game.user2 : game.user1}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {game.turn === username && (
                      <View
                        style={{
                          height: 40,
                          width: "auto",
                          flexDirection: "column",
                          justifyContent: "flex-start",
                          alignItems: "flex-start",
                        }}>
                        <NewButton
                          title="Play"
                          size="small"
                          onPress={() => {
                            toggleChooseWordModalVisibility();
                          }}
                          color="green"
                        />
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.0)",
                  paddingTop: 0,
                  width: "100%",
                  flexDirection: "row",
                }}>
                <NewButton
                  color="secondary"
                  title="Create a New Game"
                  onPress={() => {
                    toggleChooseWordModalVisibility();
                  }}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    padding: 20,
    marginTop: 60,
    gap: 20,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  menuInner: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#feeede",
    borderRadius: 15,
    gap: 20,
  },
  usernameTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
    color: COLORS.text,
  },
  textYourMove: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
  textHoursAgo: {
    color: "white",
    fontSize: 24,
    fontFamily: "TitanOne-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 2,
    textTransform: "capitalize",
  },
});
