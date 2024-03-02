import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";

const AudioPlayer = ({ source }) => {
  const [sound, setSound] = useState();

  const onPlaybackStatusUpdate = (status) => {
    // Check if the playback has finished and manually restart it
    if (status.didJustFinish && sound) {
      sound.replayAsync();
    }
  };

  useEffect(() => {
    const setupAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        source,
        {
          shouldPlay: true,
          isLooping: true,
        },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    };

    setupAudio();

    return async () => {
      if (sound) {
        await sound.unloadAsync();
        // Remove event listeners
        sound.setOnPlaybackStatusUpdate(null);
      }
    };
  }, [source]);

  return null;
};

export default AudioPlayer;
