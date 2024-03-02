import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import COLORS from "../../constants/colors";

const CELL_COUNT = 6;

const Verification = ({ propValue, setVerificationCode }) => {
  const [value, setValue] = useState(propValue);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const handleChangeText = (newValue) => {
    setValue(newValue);
    setVerificationCode(newValue); // Update the parent component state
  };

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={handleChangeText}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFiledRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  codeFiledRoot: { width: "100%", justifyContent: "space-between", gap: 2 },
  cell: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: "Kanit-Medium",
    gap: 40,
    backgroundColor: "white",
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "rgba(0,0,0,0.05)",
    borderRadius: 20,
    elevation: 0,
    height: "auto",
    width: "auto",
    textAlign: "center",
    verticalAlign: "middle",
    aspectRatio: 1,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  focusCell: {
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: COLORS.secondary,
  },
});

export default Verification;
