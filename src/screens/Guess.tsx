import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import LetterBoard from "../components/LetterBoard";
import Avatar from "../components/Avatar";
import COLORS from "../constants/colors";
import Modal from "../components/Modal";
import RewardDialog from "../components/modals/RewardDialog";
import Loading from "../components/Loading";
import GameOver from "../components/modals/GameOver";
import { Svg, Path } from "react-native-svg";
import {
  fetchGameData,
  updateGameData,
  updateUser,
  updateUserCoins,
} from "../util/DatabaseManager";

const Guess = ({ route, navigation }) => {
  const [isGameOverDialogVisible, setIsGameOverDialogVisible] = useState(false);
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
  const gameovers = [
    "Looks like your artistry took a detour into the abstract game over zone!",
    "Your sketching skills are on vacation – better luck next canvas!",
    "Your masterpiece will have to wait for a sequel!",
    "Time to sharpen those pencils, because that last attempt was a bit sketchy!",
    "Don't worry, even Da Vinci had off days. This was just your doodle moment.",
    "Your drawing board might need a motivational speech.",
    "Seems like your art just went for a coffee break. Try not to spill any creativity next time!",
    "Oops! Your drawing just pulled a Houdini – disappeared without a trace!",
    "Your art critics are on strike; time to win them back with your next stroke.",
    "Well, that didn't sketch out as planned. Time for a redraw!",
  ];

  useEffect(() => {
    if (game.word) {
      fetchDrawing();
    }
  }, []);

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

  const handleGuessCorrect = async () => {
    setLoading(true);

    // const turn = game.user1 === user.id ? game.user2 : game.user1;
    const streak = game.streak + 1;
    const reward =
      game.difficulty === "easy" ? 1 : game.difficulty === "medium" ? 2 : 3;

    // Update user
    await updateUser(user.id, [
      { field: "coins", value: user.coins + reward },
      { field: "wins", value: user.wins + 1 },
      // Add more fields as needed
    ]).then(({ data, error }) => {
      if (error) {
        console.error("Error updating user:", error);
      }
    });

    // Update opponent
    await updateUser(opponent.id, [
      { field: "coins", value: opponent.coins + reward },
      { field: "wins", value: opponent.wins + 1 },
      // Add more fields as needed
    ]).then(({ data, error }) => {
      if (error) {
        console.error("Error updating opponent:", error);
      }
    });

    // Update streak, game action to 'draw', and keep the turn the same
    await updateGameData(game.id, {
      streak: streak,
      action: "draw",
      word: null,
      requested_help: false,
    }).then(({ data, error }) => {
      if (error) {
        console.error("Error updating game action:", error);
      }
    });

    setLoading(false);
    setIsRewardDialogVisible(true);
  };

  const handleGameOver = async () => {
    setLoading(true);
    
    // Update user
    await updateUser(user.id, [
      { field: "losses", value: user.losses + 1 },
      // Add more fields as needed
    ]).then(({ data, error }) => {
      if (error) {
        console.error("Error updating user:", error);
      }
    });
    
    // Update opponent
    await updateUser(opponent.id, [
      { field: "losses", value: opponent.losses + 1 },
      // Add more fields as needed
    ]).then(({ data, error }) => {
      if (error) {
        console.error("Error updating opponent:", error);
      }
    });

    // Set streak to 0, game action to 'draw', and keep the turn the same
    await updateGameData(game.id, {
      streak: 0,
      action: "draw",
      word: null,
      requested_help: false,
    }).then(({ data, error }) => {
      if (error) {
        console.error("Error updating game action:", error);
      }
    });

    setLoading(false);
    setIsGameOverDialogVisible(true);
  };

  const onClose = () => {
    setIsRewardDialogVisible(false);
    setIsGameOverDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <>
      {loading && <Loading />}
      {isGameOverDialogVisible && (
        <Modal
          props=""
          title={gameovers[Math.floor(Math.random() * gameovers.length)]}>
          <GameOver user={user} opponent={opponent} onClose={() => onClose()} />
        </Modal>
      )}
      {isRewardDialogVisible && (
        <Modal
          props=""
          title={responses[Math.floor(Math.random() * responses.length)]}>
          <RewardDialog
            user={user}
            opponent={opponent}
            onClose={() => onClose()}
            difficulty={game.difficulty}
          />
        </Modal>
      )}
      <ScrollView
        overScrollMode="never"
        alwaysBounceVertical={false}
        style={{ backgroundColor: "transparent" }}
        contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.container}>
          <View style={styles.mainContent}>
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Avatar user={opponent} />
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.userInfoText}>
                  Guessing for{" "}
                  <Text style={styles.wordText}>{" " + opponent.username}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.drawingContainer}>
              <View style={styles.svgContainer}>
                <Svg style={styles.svg}>
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

            <View style={styles.letterBoardContainer}>
              <LetterBoard
                game={game}
                onGuessCorrect={handleGuessCorrect}
                onGameOver={handleGameOver}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    width: "100%",
    maxWidth: 500,
    marginHorizontal: "auto",
  },
  mainContent: {
    flex: 1,
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    gap: 20,
  },
  header: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    gap: 20,
  },
  avatarContainer: {
    marginLeft: 20,
    backgroundColor: COLORS.secondary,
    width: 60,
    height: 60,
  },
  userInfoContainer: {
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
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  userInfoText: {
    fontSize: 19,
    lineHeight: 22,
    alignSelf: "flex-start",
    fontFamily: "Kanit-Medium",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  wordText: {
    fontFamily: "Kanit-Bold",
    textTransform: "uppercase",
  },
  opponentText: {
    fontFamily: "Kanit-Medium",
  },
  drawingContainer: {
    width: "100%",
    height: "auto",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  svgContainer: {
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    aspectRatio: 1,
    width: "100%",
    height: "auto",
  },
  svg: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  letterBoardContainer: {
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
  },
});

export default Guess;
