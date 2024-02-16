import { TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Audio } from "expo-av";
import { Feather } from "@expo/vector-icons";

const FlatButton = (props) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = async () => {
    setIsPressed(true);
    const { sound } = await Audio.Sound.createAsync(
      require("./../assets/sfx/sfx01.mp3")
    );
    await sound.playAsync();
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const { iconName = "settings", iconSize = 30, iconColor = "white", iconLibrary = "Feather" } = props;

  // Manually handle different icon libraries
  let IconComponent;
  switch (iconLibrary) {
    case "Feather":
      IconComponent = Feather;
      break;
    // Add more cases for other icon libraries if needed

    default:
      IconComponent = Feather; // Default to Feather if no valid icon library is provided
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
