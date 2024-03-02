import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import Button from "../Button";
import COLORS from "../../constants/colors";
import { supabase } from "../../lib/supabase";
import { useNavigation } from "@react-navigation/native";

const ChooseWord = ({ user, game, onChooseWord }) => {
  const [loading, setLoading] = useState(true);
  const [remoteData, setRemoteData] = useState([]);
  const [userCoins, setUserCoins] = useState(0);
  const navigation = useNavigation();

  async function fetchWords() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("words")
        .select("word, difficulty");

      if (error) {
        throw new Error("Error fetching data");
      }

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
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchCoins() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("coins")
        .eq("id", user)
        .limit(1)
        .single();

      setUserCoins(data.coins);

      if (error) {
        throw new Error("Error fetching data");
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function updateCoins() {
    try {
      if (userCoins < 3) {
        alert("You don't have enough coins to refresh the words");
        return;
      }

      const updatedCoins = userCoins - 3;

      const { data, error } = await supabase
        .from("profiles")
        .update({
          coins: updatedCoins,
        })
        .eq("id", user);

      if (error) {
        throw new Error("Error fetching data");
      }
      
      setUserCoins(updatedCoins);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  async function refreshGameWords() {
    fetchWords();
    updateCoins();
  }

  async function updateGameWord(word: string, difficulty: string) {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("games")
        .update({ word: word, difficulty: difficulty })
        .eq("id", game.id);

      if (error) {
        console.error("Error updating game word:", error);
        throw new Error("Error updating game word");
      }

      game.word = word;
      setLoading(false);
      onChooseWord();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in updateGameWord:", error.message);
        alert(error.message);
      }
    }
  }

  useEffect(() => {
    fetchCoins();
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
              <Button
                color="primary"
                title={word.word}
                reward={index + 1}
                key={index}
                onPress={() => {
                  updateGameWord(word.word, word.difficulty);
                }}
              />
            </View>
          ))}
          {userCoins >= 3 && (
            <>
              <View
                style={{
                  height: 2,
                  width: "100%",
                  backgroundColor: "#000",
                  opacity: 0.05,
                }}></View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                }}>
                <Button
                  color="secondary"
                  title="Get new words"
                  reward="3"
                  onPress={() => {
                    refreshGameWords();
                  }}
                />
              </View>
            </>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default ChooseWord;
