import { TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { Feather } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const FlatButton = (props) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = async () => {
    setIsPressed(true);
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sfx/sfx01.mp3")
    );
    await sound.playAsync();
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const { iconName = "settings", iconSize = 30, iconColor = COLORS.text, iconLibrary = "Feather" } = props;

  let IconComponent;
  switch (iconLibrary) {
    case "Feather":
      IconComponent = Feather;
      break;

    default:
      IconComponent = Feather; 
      break;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.onPress) {
          props.onPress();
        }
      }}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <IconComponent name={iconName} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
};

export default FlatButton;
