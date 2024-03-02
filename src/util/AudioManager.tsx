import { createContext, useContext, useState, ReactNode } from 'react';
import { Audio } from 'expo-av';

interface AudioContextProps {
  playSound: (uri: string) => Promise<void>;
  pauseSound: () => Promise<void>;
}

const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);

  const playSound = async (uri: string) => {
    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    setSound(newSound);
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
  };

  return (
    <AudioContext.Provider value={{ playSound, pauseSound }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = (): AudioContextProps => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
