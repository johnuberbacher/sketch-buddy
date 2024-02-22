import { View } from "react-native";
import React, { useState } from "react";
import Canvas from "../components/Canvas";
import { useLayoutEffect } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import Modal from "../components/Modal";

const Draw = ({ route, navigation }) => {
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const { word } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const toggleConfirmDialogVisible = () => {
    setIsConfirmDialogVisible(!isConfirmDialogVisible);
  };

  const submitDrawing = () => {
    console.log("YOOOO");
    toggleConfirmDialogVisible();
  };

  const onConfirmDialog = () => {
    setIsConfirmDialogVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Guess" }],
    });
  };

  return (
    <>
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
        <Canvas onSubmitDraw={submitDrawing} word={word} />
      </View>
    </>
  );
};

export default Draw;
