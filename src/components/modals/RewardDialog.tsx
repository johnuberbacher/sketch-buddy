import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Button from "../Button";
import React, { useState, useEffect } from "react";
import Avatar from "../Avatar";
import COLORS from "../../constants/colors";
import { Audio } from "expo-av";
import ProgressBar from "../ProgressBar";

const RewardDialog = ({ user, opponent, difficulty, onClose }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const playSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../../assets/sfx/reward.mp3")
      );
      await sound.playAsync();
    };

    playSound();
  }, []);

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <View style={styles.avatarContainer}>
            <Avatar user={user} />
            <Avatar user={opponent} />
          </View>
          <ProgressBar />
          <View style={styles.infoContainer}>
            <Text style={styles.titleText}>Rank Experience</Text>
            <View style={styles.progressBarContainer}>
              <Text style={styles.progressValue}>0</Text>
              <View style={styles.progressBarBackground}>
                <View style={styles.progressBarFill}></View>
              </View>
              <Text style={styles.progressValue}>100</Text>
            </View>
            <Text style={styles.titleText}>Coins Earned</Text>
            <View style={styles.coinsContainer}>
              {Array.from(
                {
                  length:
                    difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3,
                },
                (_, index) => (
                  <ImageBackground
                    key={index}
                    style={styles.coinImage}
                    source={require("../../../assets/coin.png")}
                    resizeMode={"contain"}
                  />
                )
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Button
              color="primary"
              title="Return Home"
              onPress={() => onClose()}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    height: "100%",
    width: "100%",
    flexDirection: "column",
  },
  mainContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  avatarContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  infoContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 10,
  },
  titleText: {
    width: "100%",
    height: "auto",
    fontSize: 20,
    fontFamily: "Kanit-Bold",
    color: COLORS.secondaryDark,
    textAlign: "center",
    paddingHorizontal: 20,
    flexWrap: "wrap",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    maxWidth: 250,
    marginHorizontal: "auto",
  },
  progressValue: {
    textAlign: "center",
    minWidth: 40,
    fontSize: 18,
    fontFamily: "Kanit-Bold",
    color: COLORS.text,
  },
  progressBarBackground: {
    flex: 1,
    height: 20,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.25)",
    position: "relative",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.secondary,
  },
  coinsContainer: {
    height: "auto",
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: -10,
  },
  coinImage: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  buttonContainer: {
    width: "100%",
    height: "auto",
    flexDirection: "row",
  },
});

export default RewardDialog;
