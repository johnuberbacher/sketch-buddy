import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
  StyleSheet,
} from "react-native";
import Avatar from "../components/Avatar";
import FlatButton from "../components/FlatButton";
import Button from "./Button";
import Settings from "./Settings";
import COLORS from "../constants/colors";

const Nav = () => {
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const toggleSettingsVisibility = () => {
    setIsSettingsVisible(!isSettingsVisible);
  };

  return (
    <>
      {isSettingsVisible && (
        <Settings onClose={() => setIsSettingsVisible(false)} />
      )}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 40,
          backgroundColor: COLORS.secondary,
        }}>
        <View style={{ borderWidth: 0 }}>
          <FlatButton onPress={toggleSettingsVisibility} />
        </View>
        <View style={{ width: 60, borderWidth: 0 }}>
          <Avatar />
        </View>
      </View>
    </>
  );
};

export default Nav;
