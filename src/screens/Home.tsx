import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Alert,
  StatusBar,
  Animated,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabase";
import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import Nav from "../components/Nav";
import Button from "../components/Button";
import COLORS from "../constants/colors";
import Avatar from "../components/Avatar";
import { useNavigation } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import ChooseWord from "../components/modals/ChooseWord";
import Modal from "../components/Modal";
import CreateGame from "../components/modals/CreateGame";
import Settings from "../components/Settings";
import {
  fetchUserProfile,
  fetchUserGames,
  fetchUsers,
} from "../util/DatabaseManager";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Home = ({ navigation, route, openSettingsModal }) => {
  // Accessing the parameters from initialParams
  const { key, session } = route.params;
  const [loading, setLoading] = useState(true);
  const [gamesData, setGamesData] = useState([]);
  const [gamesUsersData, setGamesUsersData] = useState([]);
  const [isChooseWordModalVisible, setIsChooseWordModalVisible] =
    useState(false);
  const [isCreateGameModalVisible, setIsCreateGameModalVisible] =
    useState(false);
  const [isSettingsVisibleModal, setIsSettingsVisibleModal] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [currentUserData, setCurrentUserData] = useState([]);
  const [selectedGame, setSelectedGame] = useState();
  const [selectedOpponent, setSelectedOpponent] = useState([]);

  const createGame = async () => {
    setIsCreateGameModalVisible(true);
  };

  const playGame = async (game) => {
    setSelectedGame(game);

    if (!game.word) {
      setIsCreateGameModalVisible(false);
      setIsChooseWordModalVisible(true);
    } else {
      setLoading(true);

      let route = game.action.toString();
      route = route.charAt(0).toUpperCase() + route.slice(1);

      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const opponentId =
        game.user1 === session.user.id ? game.user2 : game.user1;

      // Load Opponent
      await fetchUserProfile(opponentId).then(({ data, error }) => {
        if (error) {
          console.error("Error fetching opponent profile:", error);
        } else {
          // Navigate to Draw or Guess
          navigation.reset({
            index: 0,
            routes: [
              {
                name: route,
                params: {
                  game: game,
                  user: currentUserData,
                  opponent: data,
                },
              },
            ],
          });
          setLoading(false);
        }
      });
    }
  };

  async function fetchData() {
    // Load profile data
    await fetchUserProfile(session.user.id).then(({ data, error }) => {
      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        setCurrentUserData(data);
      }
    });

    // Load games list
    await fetchUserGames(session.user.id).then(({ data, error }) => {
      if (error) {
        console.error("Error updating user data:", error);
      } else {
        const sortedGamesData = data.sort(
          (a, b): number =>
            (b.turn === session.user.id ? 1 : 0) -
            (a.turn === session.user.id ? 1 : 0)
        );
        setGamesData(sortedGamesData);
      }
    });

    // Extract unique user IDs from sortedGamesData
    const uniqueUserIds = await [
      ...new Set(gamesData.flatMap((game) => [game.user1, game.user2])),
    ].filter((userId) => userId !== session.user.id);

    // Load users data from games
    await fetchUsers(uniqueUserIds).then(({ data, error }) => {
      if (error) {
        console.error("Error updating user data:", error);
      } else {
        setGamesUsersData(data);
      }
    });

    setLoading(false);
    setRefreshing(false);
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const pulseAnimation = useRef(new Animated.Value(1)).current;

  const startPulseAnimation = () => {
    Animated.sequence([
      Animated.timing(pulseAnimation, {
        toValue: 1.1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(pulseAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => startPulseAnimation());
  };

  useEffect(() => {
    startPulseAnimation();
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="white"
            style={styles.activityIndicator}
          />
        </View>
      ) : (
        <>
          {isCreateGameModalVisible && (
            <Modal props="" title="Challenge someone to a game">
              <CreateGame
                currentUserData={currentUserData}
                onClose={() => setIsCreateGameModalVisible(false)}
                onPlayGame={(game) => playGame(game)}
              />
            </Modal>
          )}
          {isChooseWordModalVisible && (
            <Modal props="" title="Choose a word to draw">
              <ChooseWord
                user={session.user.id}
                game={selectedGame}
                onChooseWord={() => playGame(selectedGame)}
              />
            </Modal>
          )}
          {isSettingsVisibleModal && (
            <Modal props="" title="Settings">
              <Settings
                onClose={() => setIsSettingsVisibleModal(false)}
                user={session.user.id}
              />
            </Modal>
          )}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContentContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.mainContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Let's Play</Text>
                <View style={styles.imageContainer}>
                  <ImageBackground
                    style={styles.imageBackground}
                    source={require("../../assets/players.png")}
                    resizeMode={"contain"}></ImageBackground>
                </View>
              </View>
              <View style={styles.menu}>
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <ImageBackground
                      style={styles.statImage}
                      source={require("../../assets/s1.png")}
                      resizeMode={"contain"}></ImageBackground>
                    <View style={styles.statTextContainer}>
                      <Text style={styles.statTextTitle}>Level</Text>
                      <Text style={styles.statTextValue}>
                        {currentUserData.rank ?? "null"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.separator}></View>

                  <View style={styles.statItem}>
                    <ImageBackground
                      style={styles.statImage}
                      source={require("../../assets/coin.png")}
                      resizeMode={"contain"}></ImageBackground>
                    <View style={styles.statTextContainer}>
                      <Text style={styles.statTextTitle}>Coins</Text>
                      <Text style={styles.statTextValue}>
                        {currentUserData.coins ?? "null"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.menuActions}>
                  <Text style={styles.menuHeaderText}>My Games</Text>
                  <View style={styles.leaderboardButton}>
                    <Button
                      title="Leaderboard"
                      size="small"
                      onPress={() => navigation.navigate("Leaderboard")}
                      color="secondary"
                    />
                  </View>
                </View>

                {gamesData.length === 0 ? (
                  <View style={styles.noGamesContainer}>
                    <Text style={styles.noGamesText}>
                      You don't have any games! Click the button below to start
                      a new game.
                    </Text>
                  </View>
                ) : (
                  gamesData.map((game, index) => (
                    <View key={game.id} style={styles.menuInner}>
                      <View style={styles.gameInfoContainer}>
                        <View style={styles.streakContainer}>
                          <Text style={styles.streakText}>STREAK</Text>
                          <Text style={styles.streakValue}>{game.streak}</Text>
                        </View>
                        <View style={styles.avatarContainer}>
                          <Avatar user={gamesData} />
                        </View>
                        <View style={styles.userInfoContainer}>
                          <Text style={styles.usernameTitle}>
                            {game.user1 === session.user.id
                              ? game.user2username
                              : game.user1username}
                          </Text>
                          <Text style={styles.textYourMove}>
                            {game.turn === session.user.id
                              ? "Your move!"
                              : "Waiting..."}
                          </Text>
                        </View>
                      </View>
                      {game.turn === session.user.id && (
                        <Animated.View
                          style={{
                            height: 40,
                            width: "auto",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            transform: [{ scale: pulseAnimation }],
                          }}>
                          <Button
                            title={game.action === "draw" ? "Draw" : "Guess"}
                            size="small"
                            onPress={() => playGame(game)}
                            color="green"
                          />
                        </Animated.View>
                      )}
                    </View>
                  ))
                )}

                <View style={styles.createGameButtonContainer}>
                  <Button
                    color="secondary"
                    title="Create a New Game"
                    onPress={() => createGame()}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    gap: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    transform: [{ scale: 2 }],
  },
  scrollView: {
    backgroundColor: "transparent",
  },
  scrollContentContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    height: "100%",
    maxWidth: 500,
    marginHorizontal: "auto",
    gap: 20,
    paddingTop: 50,
  },
  headerContainer: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 34,
    fontFamily: "Kanit-Bold",
    color: COLORS.text,
  },
  imageContainer: {
    position: "absolute",
    zIndex: 0,
    right: 20,
    width: "50%",
    height: "auto",
    marginHorizontal: "auto",
    marginTop: 25,
  },
  imageBackground: {
    width: "100%",
    height: "auto",
    aspectRatio: 1,
  },
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
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#feeede",
    borderRadius: 15,
    gap: 20,
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: -80,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 20,
  },
  statImage: {
    width: 50,
    height: 50,
  },
  statTextContainer: {
    flexDirection: "column",
    paddingVertical: 5,
  },
  statTextTitle: {
    fontSize: 18,
    fontFamily: "Kanit-Regular",
    color: COLORS.text,
    opacity: 0.5,
  },
  statTextValue: {
    fontSize: 18,
    fontFamily: "Kanit-Bold",
    color: COLORS.text,
  },
  separator: {
    height: "100%",
    width: 2,
    backgroundColor: "#000",
    opacity: 0.05,
  },
  menuActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  menuHeaderText: {
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    color: COLORS.text,
  },
  leaderboardButton: {
    view: {
      width: "30%",
    },
  },
  noGamesContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  noGamesText: {
    fontSize: 16,
    fontFamily: "Kanit-Regular",
    color: COLORS.text,
    opacity: 0.5,
    textAlign: "center",
  },
  gameInfoContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    flex: 1,
  },
  streakContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    backgroundColor: COLORS.secondaryDark,
    borderRadius: 15,
    opacity: 0.75,
  },
  streakText: {
    fontSize: 8,
    fontFamily: "Kanit-SemiBold",
    color: "white",
    marginBottom: -8,
    marginTop: 4,
  },
  streakValue: {
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    color: "white",
  },
  avatarContainer: {
    width: 60,
  },
  userInfoContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: 2,
  },
  usernameTitle: {
    fontSize: 16,
    fontFamily: "Kanit-Medium",
    marginLeft: 10,
    color: COLORS.text,
  },
  textYourMove: {
    fontSize: 14,
    fontFamily: "Kanit-Regular",
    marginLeft: 10,
    color: COLORS.text,
    opacity: 0.5,
  },
  createGameButtonContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.0)",
    paddingTop: 0,
    width: "100%",
    flexDirection: "row",
  },
});

export default Home;
