import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

const CanvasTools = ({
  onSaveDrawing,
  onEraser,
  onClearCanvas,
  onStrokeSizeChange,
}) => {
  const strokeArray = [8, 12, 16, 20, 24];

  const [selectedStrokeSize, setSelectedStrokeSize] = useState(strokeArray[0]);

  const handleStrokeSizeSelect = (stroke) => {
    setSelectedStrokeSize(stroke);
    onStrokeSizeChange(stroke);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        {strokeArray.map((stroke) => (
          <TouchableOpacity
            key={stroke}
            onPress={() => handleStrokeSizeSelect(stroke)}
            style={styles.box}>
            <View
              style={[
                styles.stroke,
                {
                  height: stroke,
                  width: stroke,
                },
              ]}></View>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 0,
        }}>
        <TouchableOpacity onPress={() => null} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="palette-swatch-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => null} style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="lead-pencil"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onEraser();
          }}
          style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons name="eraser" size={30} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onSaveDrawing();
          }}
          style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="content-save-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            onClearCanvas();
          }}
          style={styles.tool}>
          <View style={{}}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={30}
              color="white"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  tool: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    elevation: 2,
  },
  box: {
    backgroundColor: "white",
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    elevation: 2,
  },
  stroke: {
    borderRadius: 100,
    backgroundColor: "black",
  },
  buttonBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default CanvasTools;
