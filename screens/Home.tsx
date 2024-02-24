import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Alert,
  RefreshControl,
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

const Home = ({ route }) => {
  // Accessing the parameters from initialParams
  const { key, session } = route.params;
  const [loading, setLoading] = useState(true);
  const [gamesData, setGamesData] = useState<any[]>([]);
  const [coins, setCoins] = useState(0);
  const [rank, setRank] = useState(0);
  const navigation = useNavigation();
  const [isChooseWordVisibleModal, setIsChooseWordModalVisible] =
    useState(false);
  const [selectedGame, setSelectedGame] = useState();
  const [refreshing, setRefreshing] = React.useState(false);

  const playGame = async (game) => {
    setSelectedGame(game);

    if (!game.word) {
      setIsChooseWordModalVisible(true);
    } else {
      setLoading(true);

      let route = game.action.toString();
      route = route.charAt(0).toUpperCase() + route.slice(1);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      navigation.reset({
        index: 0,
        routes: [
          { name: route, params: { game: game, user: session?.user.id } },
        ],
      });
      setLoading(false);
    }
  };

  async function fetchData() {
    try {
      // Load profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, rank, coins")
        .eq("id", session?.user.id)
        .single();
      setRank(profileData.rank);
      setCoins(profileData.coins);

      // Load relevant games data
      console.log("Fetching relevant data from 'games' table...");
      const { data: relevantGamesData } = await supabase
        .from("games")
        .select("*")
        .or(
          "user1.eq." + session.user.id + ",user2.eq." + session.user.id + ""
        );
      setGamesData(relevantGamesData);
    } catch (error) {
      console.error("Error in fetchData:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    // This block will run whenever gamesData is updated
    // console.log("Sorted data updated:", gamesData);
  }, [gamesData]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, []);

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
              <ChooseWord
                selectedGame={selectedGame}
                onClose={() => playGame(selectedGame)}
              />
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
                position: "relative",
              }}>
              <Text
                style={{
                  fontSize: 34,
                  fontFamily: "Kanit-Bold",
                  color: COLORS.text,
                }}>
                Let's Play
              </Text>
              <ImageBackground
                style={{
                  zIndex: 0,
                  transform: [{ scaleX: -1 }],
                  right: 50,
                  top: -60,
                  position: "absolute",
                  width: 180,
                  height: 180,
                  marginHorizontal: "auto",
                }}
                source={require("../assets/fox.png")}
                resizeMode={"contain"}></ImageBackground>
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
                      {rank ?? "null"}/100
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
                      {coins ?? "null"}
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
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }>
                {gamesData.map((game) => (
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
                            {game.user1 === session.user.id
                              ? game.user2username
                              : game.user1username}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {game.turn === session.user.id && (
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
                            playGame(game);
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
                    playGame("");
                  }}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </>
  );
};

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

export default Home;
