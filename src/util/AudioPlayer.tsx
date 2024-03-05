// AudioPlayer.js
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import { useAudioManager } from "./AudioManager";

const AudioPlayer = ({ source }) => {
  const { isMuted } = useAudioManager();
  const [sound, setSound] = useState();

  const onPlaybackStatusUpdate = (status) => {
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
          volume: isMuted ? 0 : 1, // Adjust volume based on mute state
        },
        onPlaybackStatusUpdate
      );
      setSound(sound);
    };

    setupAudio();

    return async () => {
      if (sound) {
        await sound.unloadAsync();
      }
    };
  }, [source, isMuted]);

  return null;
};

export default AudioPlayer;
