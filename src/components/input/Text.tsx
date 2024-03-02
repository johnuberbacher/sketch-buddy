import { Text, StyleSheet, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import COLORS from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TextField = (props) => {
  const textInputStyles = StyleSheet.flatten([
    styles.textInputStyles,
    {
      filter: props.disabled ? "grayscale(100%)" : "none",
    },
  ]);

  return (
    <>
      {props.label ? (
        <Text
          style={{
            color: COLORS.text,
            fontFamily: "Kanit-Regular",
            fontSize: 14,
            marginBottom: -15,
          }}>
          {props.label}
        </Text>
      ) : null}
      <TextInput
        style={textInputStyles}
        editable={props.disabled ? false : true}
        selectTextOnFocus={props.disabled ? false : true}
        onChangeText={(text) => props.onChangeText(text)}
        value={props.value}
        placeholder={props.placeholder || undefined}
        placeholderTextColor="rgba(0,0,0,0.5)"
        autoCapitalize={"none"}
      />
    </>
  );
};

const styles = StyleSheet.create({
  textInputStyles: {
    width: "100%",
    color: COLORS.text,
    fontSize: 18,
    fontFamily: "Kanit-Medium",
    paddingHorizontal: 25,
    paddingVertical: 15,
    gap: 40,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.05)",
    borderStyle: "solid",
    borderRadius: 10,
    elevation: 0,
  },
});

export default TextField;
