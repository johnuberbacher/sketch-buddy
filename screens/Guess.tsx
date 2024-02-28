import {
  SafeAreaView,
  Platform,
  StatusBar,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  StyleSheet,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import LetterBoard from "../components/LetterBoard";
import FlatButton from "../components/FlatButton";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import NewButton from "../components/NewButton";
import Modal from "../components/Modal";
import RewardDialog from "../components/RewardDialog";
import Loading from "../components/Loading";
import { supabase } from "../lib/supabase";
import { Svg, Path } from "react-native-svg";
import { fetchGameData } from "../util/DatabaseManager";

const Guess = ({ route, navigation }) => {
  const [isRewardDialogVisible, setIsRewardDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawingPaths, setDrawingPaths] = useState([]);
  const { game, user, opponent } = route.params;
  const responses = [
    "You really know how to sketch out the correct answer!",
    "That's the right sketch of things!",
    "You've drawn the correct conclusion!",
    "Your intuition has quite the artistic flair, drawing in the correct response!",
    "You've sketched the right idea on the canvas of this question!",
    "Your accuracy is drawing applause!",
    "You've drawn the bullseye on this one!",
    "Your guesswork is quite the masterpiece, drawing in correctness!",
    "That's the sketch of it – you're absolutely right!",
    "Your mental sketchpad is filled with the right answers!",
  ];

  useEffect(() => {
    if (game.word) {
      fetchDrawing();
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  async function fetchDrawing() {
    await fetchGameData(game.id).then(({ data, error }) => {
      if (error) {
        console.error("Error fetching game data:", error);
      } else {
        // Use a loop with setTimeout to add each entry to drawingPaths with a 1-second delay
        const svgArray = data.svg || [];
        for (let i = 0; i < svgArray.length; i++) {
          setTimeout(() => {
            setDrawingPaths((prevPaths) => [...prevPaths, svgArray[i]]);
          }, i * 1000); // 1000 milliseconds = 1 second
        }
        setLoading(false);
      }
    });
  }

  async function updateUserStats() {
    try {
      const updateUserData = async (userId) => {
        const userData = await supabase
          .from("profiles")
          .select("rank, coins")
          .eq("id", userId)
          .limit(1)
          .single();

        if (userData.error) {
          throw new Error(
            `Error updating user ${userId}: ${userData.error.message}`
          );
        }

        if (
          !userData.data ||
          userData.data.length === 0 ||
          userData.data.coins === null
        ) {
          throw new Error(
            `Invalid data for user ${userId}: Coins data is missing or null`
          );
        }

        const updatedCoins = userData.data.coins + reward;

        // Update user
        const updateUser = await supabase
          .from("profiles")
          .update({ coins: updatedCoins })
          .eq("id", userId);

        if (updateUser.error) {
          throw new Error(
            `Error updating user ${userId}: ${updateUser.error.message}`
          );
        }
      };

      const reward =
        game.difficulty === "easy" ? 1 : game.difficulty === "medium" ? 2 : 3;

      // Update user 1
      await updateUserData(game.user1);

      // Update user 2 only after user 1 is updated
      await updateUserData(game.user2);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function updateGameTurn() {
    try {
      const gameData = await supabase
        .from("games")
        .select("streak")
        .eq("id", game.id)
        .limit(1)
        .single();

      if (gameData.error) {
        throw new Error(
          `Error fetching game ${game.id}: ${gameData.error.message}`
        );
      }

      const turn = game.user1 === user.id ? game.user2 : game.user1;
      const streak = gameData.data.streak + 1;

      const { data, error } = await supabase
        .from("games")
        .update({
          word: null,
          turn: turn,
          action: "draw",
          streak: streak,
        })
        .eq("id", game.id);

      if (error) {
        throw new Error("Error updating game turn");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  const handleGuessCorrect = async () => {
    setLoading(true);
    updateUserStats();
    updateGameTurn();
    setIsRewardDialogVisible(true);
    setLoading(false);
  };

  const handleRequestHelp = async () => {
    // check if enough coins
    // remove letters
    // remove coins
  };

  const onContinuePlaying = () => {
    setIsRewardDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const onRewardDialog = () => {
    setIsRewardDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <>
      {loading && <Loading />}
      {isRewardDialogVisible && (
        <Modal
          props=""
          title={responses[Math.floor(Math.random() * responses.length)]}>
          <RewardDialog
            user={user}
            opponent={opponent}
            onContinuePlaying={() => onRewardDialog()}
            onClose={() => onRewardDialog()}
            difficulty={game.difficulty}
          />
        </Modal>
      )}
      <ScrollView
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            height: "100%",
            width: "100%",
            maxWidth: 500,
            marginHorizontal: "auto",
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              gap: 20,
            }}>
            <View
              style={{
                width: "100%",
                height: "auto",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: 20,
                gap: 20,
              }}>
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 20,
                }}>
                <View
                  style={{
                    marginLeft: 20,
                    backgroundColor: COLORS.secondary,
                    width: 60,
                    height: 60,
                  }}>
                  <Avatar user={opponent} />
                </View>
                <View
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    height: 60,
                    width: "100%",
                    paddingLeft: 25,
                    paddingRight: 20,
                    paddingTop: 4,
                    borderTopStartRadius: 40,
                    borderBottomStartRadius: 40,
                    backgroundColor: COLORS.primary,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.34,
                    shadowRadius: 6.27,
                    elevation: 10,
                  }}>
                  <Text
                    selectable={false}
                    style={{
                      fontSize: 19,
                      lineHeight: 22,
                      alignSelf: "flex-start",
                      fontFamily: "Kanit-Medium",
                      color: "white",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                    Guessing for 
                    <Text
                      selectable={false}
                      style={{ fontFamily: "Kanit-Bold" }}>
                      {' ' + opponent.username}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 20,
              }}>
              <View
                style={{
                  width: "100%",
                  height: "auto",
                  backgroundColor: "#fff",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 20,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 10,
                  aspectRatio: 1,
                  position: "relative",
                }}>
                <Svg style={styles.svgContainer}>
                  {drawingPaths?.map((pathObject, pathIndex) => (
                    <Path
                      key={pathObject + pathIndex}
                      d={pathObject.path.join(" ")}
                      stroke={pathObject.color}
                      strokeWidth={pathObject.strokeSize}
                      strokeLinecap="round"
                      fill="none"
                    />
                  ))}
                </Svg>
              </View>
            </View>

            <View
              style={{
                width: "100%",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-start",
                backgroundColor: "white",
                borderTopStartRadius: 40,
                borderTopEndRadius: 40,
                padding: 20,
                gap: 15,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                shadowOffset: {
                  width: 0,
                  height: 0,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,
                elevation: 10,
              }}>
              <LetterBoard
                word={game.word}
                difficulty={game.difficulty}
                onGuessCorrect={handleGuessCorrect}
              />
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  gap: 10,
                }}>
                <NewButton
                  color="primary"
                  title="Give up"
                  onPress={() => {
                    //
                  }}
                />
                <View
                  style={{
                    width: "65%",
                    flexDirection: "row",
                  }}>
                  <NewButton
                    title="I Need Help"
                    reward="2"
                    onPress={() => handleRequestHelp()}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  svgContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    height: "100%",
  },
});

export default Guess;
