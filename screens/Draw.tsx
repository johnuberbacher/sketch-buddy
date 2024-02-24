import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Canvas from "../components/Canvas";
import { useLayoutEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";
import Loading from "../components/Loading";
import { supabase } from "../lib/supabase";

const Draw = ({ route, navigation }) => {
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const { game, user } = route.params;

  useEffect(() => {
    if (game.word) {
      setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    game;
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  async function updateGameTurn() {
    try {
      setLoading(true);

      const turn = game.user1 === user ? game.user2 : game.user1;

      const { data, error } = await supabase
        .from("games")
        .update({ word: game.word, turn: turn, action: "guess" })
        .eq("id", game.id)
        .select();

      if (error) {
        throw new Error("Error updating game turn");
      }
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  const handleSubmitDrawing = async () => {
    updateGameTurn();
    setIsConfirmDialogVisible(true);
  };

  const onConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <>
      {loading && <Loading />}
      {isConfirmDialogVisible && (
        <Modal props="" title="Drawing sent!">
          <ConfirmDialog onClose={() => onConfirmDialog()} />
        </Modal>
      )}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}>
        <Canvas onSubmitDraw={handleSubmitDrawing} word={game.word} />
      </View>
    </>
  );
};

export default Draw;
