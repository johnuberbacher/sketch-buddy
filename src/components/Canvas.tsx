import React, { useState, useRef } from "react";
import { Svg, Path } from "react-native-svg";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { StyleSheet, View, Text, Platform } from "react-native";
import NewButton from "./Button";
import CanvasTools from "./CanvasTools";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

const Canvas = ({ onSubmitDraw, toggleScrollable }) => {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedStrokeSize, setSelectedStrokeSize] = useState(8);
  const [eraserActive, setEraserActive] = useState(false);
  const [isToolbarVisible, setIsToolbarVisible] = useState(false);
  const startPointRef = useRef({ x: 0, y: 0 });
  const viewShotRef = useRef<ViewShot>(null);

  const handleToolbarVisibilityChange = (newVisibility) => {
    setIsToolbarVisible(newVisibility);
  };

  const onLayoutHandler = (event) => {
    const { width, height } = event.nativeEvent.layout;
  };

  const smoothPath = (path) => {
    if (path.length < 2) return path;

    return path.reduce((acc, point, i, arr) => {
      if (i === 0) {
        return [`M${point.x},${point.y}`];
      }

      const prevPoint = arr[i - 1];
      const midPoint = {
        x: (point.x + prevPoint.x) / 2,
        y: (point.y + prevPoint.y) / 2,
      };

      return [
        ...acc,
        `Q${prevPoint.x},${prevPoint.y} ${midPoint.x},${midPoint.y}`,
      ];
    }, []);
  };

  const handleGestureEvent = ({ nativeEvent }) => {
    if (Platform.OS === 'ios') {
      console.log("Gesture Event (iOS):", nativeEvent);
    } else if (Platform.OS === 'android') {
      console.log("Gesture Event (Android):", nativeEvent);
    }
  
    toggleScrollable();
    const { x, y } = nativeEvent;

    setCurrentPath((prevPath) => [...prevPath, { x, y }]);
  };

  const handleGestureStateChange = ({ nativeEvent }) => {
    if (Platform.OS === 'ios') {
      console.log("Gesture Event (iOS):", nativeEvent);
    } else if (Platform.OS === 'android') {
      console.log("Gesture Event (Android):", nativeEvent);
    }
    
    if (nativeEvent.state === State.BEGAN) {
      startPointRef.current = { x: nativeEvent.x, y: nativeEvent.y };
      setCurrentPath([{ x: nativeEvent.x, y: nativeEvent.y }]);
    } else if (nativeEvent.state === State.END) {
      setPaths((prevPaths) => [
        ...prevPaths,
        {
          path: smoothPath(currentPath),
          color: selectedColor ? selectedColor : "#000000",
          strokeSize: eraserActive ? 12 : selectedStrokeSize,
        },
      ]);
      setCurrentPath([]);
    }
  };

  const handleGestureEnd = () => {
    toggleScrollable();
  };

  const handleStrokeSizeChange = (stroke) => {
    if (!eraserActive) {
      setSelectedStrokeSize(stroke);
    }
  };

  const handleColorChange = (color) => {
    if (!eraserActive) {
      setSelectedColor(color);
    }
  };

  const handleClearCanvas = () => {
    setPaths([]);
  };

  const handleSaveDrawing = async () => {
    try {
      // Request permission to access the media library
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== "granted") {
        // Permission denied, show an alert or handle accordingly
        console.error(
          "Permission Denied", 
          "Please grant permission to access the media library."
        );
        //  return;
      }

      const uri = await viewShotRef.current.capture();
      const fileUri = `${FileSystem.documentDirectory}capturedImage.png`;

      // Save the image to a specific folder on the device
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Save the image to the media library
      await MediaLibrary.saveToLibraryAsync(fileUri);

      console.log("Image saved to media library:", fileUri);
    } catch (error) {
      console.error("Error capturing and saving image:", error);
    }
  };

  const handleEraser = () => {
    setSelectedColor("#fff");
  };

  const submitDrawing = () => {
    onSubmitDraw(paths);
  };

  return (
    <>
      <ViewShot
        ref={viewShotRef}
        options={{ format: "png", quality: 1 }}
        style={styles.viewShotContainer}>
        <View
          onLayout={(event) => onLayoutHandler(event)}
          style={styles.container}>
          <GestureHandlerRootView style={styles.gestureHandlerRoot}>
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
              onEnded={handleGestureEnd}
              style={styles.panGestureHandler}
              avgTouches
              enabled>
              <Svg style={styles.svgContainer}>
                {paths.map((pathObject, pathIndex) => (
                  <Path
                    key={pathObject + pathIndex}
                    d={pathObject.path.join(" ")}
                    stroke={eraserActive ? "#fff" : pathObject.color}
                    strokeWidth={pathObject.strokeSize}
                    strokeLinecap="round"
                    fill="none"
                  />
                ))}
                {currentPath.length > 1 && (
                  <Path
                    d={smoothPath(currentPath).join(" ")}
                    stroke={eraserActive ? "#fff" : selectedColor}
                    strokeWidth={eraserActive ? 12 : selectedStrokeSize}
                    strokeLinecap="round"
                    fill="none"
                  />
                )}
              </Svg>
            </PanGestureHandler>
          </GestureHandlerRootView>
        </View>
      </ViewShot>

      <View style={styles.bottomContainer}>
        <CanvasTools
          onSaveDrawing={handleSaveDrawing}
          onEraser={handleEraser}
          onClearCanvas={handleClearCanvas}
          onStrokeSizeChange={handleStrokeSizeChange}
          onColorChange={handleColorChange}
          isToolbarVisible={isToolbarVisible}
          onToolbarVisibilityChange={handleToolbarVisibilityChange}
        />
        <View style={styles.buttonContainer}>
          <NewButton
            color="secondary"
            title="Continue"
            onPress={submitDrawing}
          />
        </View>
      </View>

      {isToolbarVisible && (
        <GestureHandlerRootView
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            zIndex: 1,
          }}>
          <TouchableWithoutFeedback
            style={{
              height: "100%",
              width: "100%",
            }}
            onPress={() =>
              handleToolbarVisibilityChange(false)
            }></TouchableWithoutFeedback>
        </GestureHandlerRootView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  viewShotContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    aspectRatio: 1,
  },
  gestureHandlerRoot: {
    flex: 1,
    width: "100%",
  },
  panGestureHandler: {
    height: "100%",
  },
  svgContainer: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  bottomContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    zIndex: 2,
  },
  buttonContainer: {
    height: "auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "stretch",
    gap: 20,
  },
});

export default Canvas;
