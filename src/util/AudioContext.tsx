// AudioContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Audio } from "expo-av";

type AudioContextType = {
  soundObject: Audio.Sound | null;
  isPlaying: boolean;
  isMuted: boolean;
  playAudio: (fileUri: string) => void;
  muteAudio: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const startAudio = async () => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "../../assets/music/Catwalk.wav" },
        { shouldPlay: true, isLooping: true },
        onPlaybackStatusUpdate
      );

      setSoundObject(sound);
    };

    startAudio();

    return () => {
      // Clean up resources when the component unmounts
      if (soundObject) {
        soundObject.unloadAsync();
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status: Audio.PlaybackStatus) => {
    if (status.didJustFinish) {
      // If it finished playing and should not continue playing, set isPlaying to false
      setIsPlaying(false);
    }
  };

  const playAudio = async (fileUri: string) => {
    if (soundObject) {
      // Unload the existing sound if it's already playing
      await soundObject.stopAsync();
      await soundObject.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: fileUri },
      { shouldPlay: true, isLooping: true, volume: 0.25 },
      onPlaybackStatusUpdate
    );

    setSoundObject(sound);
    setIsPlaying(true);
  };

  const muteAudio = async () => {
    if (soundObject) {
      const newMutedState = !isMuted;
      await soundObject.setIsMutedAsync(newMutedState);
      setIsMuted(newMutedState);
    }
  };

  return (
    <AudioContext.Provider
      value={{ soundObject, isPlaying, isMuted, playAudio, muteAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
