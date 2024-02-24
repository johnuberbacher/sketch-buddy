import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import NewButton from "./NewButton";
import COLORS from "../constants/colors";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";

const ChooseWord = ({ selectedGame, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [remoteData, setRemoteData] = useState([]);
  const navigation = useNavigation();

  async function fetchWords() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("words")
        .select("word, difficulty");

      console.log(data);

      if (error) {
        console.error("Error fetching data:", error.message);
        throw new Error("Error fetching data");
      }

      console.log("ChooseWord: Data fetched successfully");

      const getRandomEntry = (arr) =>
        arr[Math.floor(Math.random() * arr.length)];

      const randomWords = [
        getRandomEntry(data.filter((entry) => entry.difficulty === "easy")),
        getRandomEntry(data.filter((entry) => entry.difficulty === "medium")),
        getRandomEntry(data.filter((entry) => entry.difficulty === "hard")),
      ];


      setRemoteData(randomWords);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in fetchWords:", error.message);
        alert(error.message);
      }
    } finally {
      setLoading(false);
      console.log("ChooseWord: Loading state set to false.");
    }
  }

  async function updateGameWord(word: string, difficulty: string) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("games")
        .update({ word: word, difficulty: difficulty })
        .eq("id", selectedGame.id)
        .select();

      if (error) {
        console.error("Error updating game word:", error);
        throw new Error("Error updating game word");
      }

      console.log("Game word updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in updateGameWord:", error.message);
        alert(error.message);
      }
    } finally {
      selectedGame.word = word;
      setLoading(false);
      onClose();
    }
  }

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{
            paddingVertical: 40,
            height: "100%",
            width: "100%",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
        </View>
      ) : (
        <>
          {remoteData.map((word, index) => (
            <View
              key={word.word}
              style={{
                width: "100%",
                flexDirection: "row",
              }}>
              <NewButton
                color="primary"
                title={word.word}
                reward={index + 1}
                key={word.word}
                onPress={() => {
                  updateGameWord(word.word, word.difficulty);
                }}
              />
            </View>
          ))}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.25)",
    // rgb(255, 193, 90, 0.5)
    zIndex: 10,
    padding: 40,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayInner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1.0)",
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
    fontSize: 24,
    fontFamily: "Kanit-SemiBold",
    color: COLORS.text,
    textAlign: "center",
  },
});

export default ChooseWord;
