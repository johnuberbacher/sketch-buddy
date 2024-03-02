import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LetterButton from "../components/LetterButton";
import Button from "../components/Button";
import COLORS from "../constants/colors";
import { Audio } from "expo-av";
import { updateGameData } from "../util/DatabaseManager";

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const LetterBoard = ({ game, onGuessCorrect, onGameOver }) => {
  const [optionLetters, setOptionLetters] = useState([]);
  const [answerLetters, setAnswerLetters] = useState([]);
  const [isSelected, setIsSelected] = useState(Array(12).fill(false));
  const [victoryStyles, setVictoryStyles] = useState(null);
  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  let difficultyLength = 14;
  const emptyButtons = Array(6).fill(null);

  useEffect(() => {
    const staticWordFrequencyMap = new Map(
      [...game.word].map((char) => [char, 1])
    );

    // Ensure that staticWord letters are included in optionLetters
    const staticWordLetters = generateCharactersFromFrequency(
      staticWordFrequencyMap,
      game.word.length
    );

    const usedChars = new Set([...staticWordLetters]);
    if (game.difficulty === "medium" || game.difficulty === "hard") {
      // difficultyLength = 14;
    }

    const randomLetters = Array.from(
      { length: difficultyLength - game.word.length },
      () => {
        let randomChar;
        do {
          randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
        } while (usedChars.has(randomChar));
        usedChars.add(randomChar);
        return randomChar;
      }
    );

    const combinedLetters = staticWordLetters.concat(randomLetters);
    shuffleArray(combinedLetters);
    setOptionLetters(combinedLetters);
  }, [game.word]);

  const generateCharactersFromFrequency = (frequencyMap, totalCharacters) => {
    const characters = [];
    const usedChars = new Set(); // Keep track of used characters

    const uniqueChars = Array.from(frequencyMap.keys());

    while (characters.length < totalCharacters && uniqueChars.length > 0) {
      const char = uniqueChars.shift();
      for (let i = 0; i < frequencyMap.get(char); i++) {
        characters.push(char);
        usedChars.add(char);
      }
    }

    const remainingCharacters = totalCharacters - characters.length;

    // Add random characters from the alphabet to meet the remainingCharacters requirement
    for (let i = 0; i < remainingCharacters; i++) {
      let randomChar;
      do {
        randomChar = alphabet[Math.floor(Math.random() * alphabet.length)];
      } while (usedChars.has(randomChar));

      characters.push(randomChar);
      usedChars.add(randomChar);
    }

    return characters;
  };

  const handleLetterButtonClick = (title, index) => {
    setAnswerLetters((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(title);

      // Check if the letter is already selected
      if (selectedIndex !== -1) {
        const updatedSelected = [...prevSelected];
        updatedSelected.splice(selectedIndex, 1);

        setIsSelected((prevSelectedStatus) => {
          const updatedSelectedStatus = [...prevSelectedStatus];
          const originalIndexInLetterBoard = optionLetters.indexOf(title);

          if (originalIndexInLetterBoard !== -1) {
            updatedSelectedStatus[originalIndexInLetterBoard] = false;
          }

          return updatedSelectedStatus;
        });

        return updatedSelected;
      }

      // Check if the maximum number of selected letters is reached (6)
      if (prevSelected.length >= difficultyLength / 2) {
        return prevSelected;
      }

      return [...prevSelected, title];
    });

    // Only handle UI update for the letter button if the maximum is not reached
    if (answerLetters.length < difficultyLength / 2) {
      setIsSelected((prevSelectedStatus) => {
        const originalIndexInLetterBoard = optionLetters.indexOf(title);
        if (originalIndexInLetterBoard !== -1) {
          const updatedSelectedStatus = [...prevSelectedStatus];
          updatedSelectedStatus[originalIndexInLetterBoard] = true;
          return updatedSelectedStatus;
        }
        return prevSelectedStatus;
      });
    }
  };

  const handleSelectedLetterClick = (title, index) => {
    setAnswerLetters((prevSelected) => {
      const selectedIndex = prevSelected.indexOf(title);

      if (selectedIndex !== -1) {
        const updatedSelected = [...prevSelected];
        updatedSelected.splice(selectedIndex, 1);

        setIsSelected((prevSelectedStatus) => {
          const updatedSelectedStatus = [...prevSelectedStatus];
          const originalIndexInLetterBoard = optionLetters.indexOf(title);

          if (originalIndexInLetterBoard !== -1) {
            updatedSelectedStatus[originalIndexInLetterBoard] = false;
          }

          return updatedSelectedStatus;
        });

        return updatedSelected;
      }

      // Check if adding the letter exceeds difficultyLength / 2 letters
      if (prevSelected.length >= difficultyLength / 2) {
        return prevSelected;
      }

      return [...prevSelected, title];
    });

    if (index < answerLetters.length) {
      setIsSelected((prevSelectedStatus) => {
        const originalIndexInLetterBoard = optionLetters.indexOf(title);
        if (originalIndexInLetterBoard !== -1) {
          const updatedSelectedStatus = [...prevSelectedStatus];
          updatedSelectedStatus[originalIndexInLetterBoard] = false;
          return updatedSelectedStatus;
        }
        return prevSelectedStatus;
      });
    }
  };
  const onRequestHelp = async () => {
    // Check if help has already been requested
    if (game.requested_help) {
      console.error("Help already requested.");
      return;
    }

    try {
      // Update game data to mark help as requested
      const { data, error } = await updateGameData(game.id, {
        requested_help: true,
      });

      if (error) {
        console.error("Error updating game action:", error);
        return;
      }

      // Update local game state
      game.requested_help = true;

      // Log information about the game state
      console.log(
        "game.word contains all available letters, including the static word letters:"
      );
      console.log(game.word);

      console.log(
        "optionLetters are the letters that MUST be present, logging an array of letters:"
      );
      console.log(optionLetters);

      // Convert game.word to an array of letters
      const gameWordLetters = game.word.split("");

      // Calculate available letters for help only from optionLetters and not in game.word
      const availableLetters = optionLetters.filter(
        (letter) =>
          !answerLetters.includes(letter) && !gameWordLetters.includes(letter)
      );

      if (availableLetters.length < 4) {
        console.error("Not enough available letters for help.");
        return;
      }

      // Shuffle and select 4 help letters
      const shuffledLetters = availableLetters.sort(() => Math.random() - 0.5);
      const helpLetters = shuffledLetters.slice(0, 4);

      // Update isSelected state based on the selected help letters
      setIsSelected((prevSelectedStatus) => {
        const updatedSelectedStatus = [...prevSelectedStatus];

        // Set the selected status for the help letters
        helpLetters.forEach((letter) => {
          const originalIndexInLetterBoard = optionLetters.indexOf(letter);
          if (originalIndexInLetterBoard !== -1) {
            updatedSelectedStatus[originalIndexInLetterBoard] = true;
          }
        });

        return updatedSelectedStatus;
      });
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const wrapperStyles = StyleSheet.flatten([
    styles.wrapperStyles,
    victoryStyles,
  ]);

  useEffect(() => {
    const checkAnswerAndPerformAction = async () => {
      if (answerLetters.join("") === game.word) {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/sfx/correct.mp3")
        );
        await sound.playAsync();
        setVictoryStyles({
          backgroundColor: "green",
          color: "white",
        });
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        onGuessCorrect();
      } else {
        setVictoryStyles({});
      }
    };

    checkAnswerAndPerformAction();
  }, [answerLetters, game.word]);

  return (
    <>
      <View style={styles.wrapperStyles}>
        {answerLetters.map((letter, index) => (
          <LetterButton
            color="secondary"
            key={index}
            title={letter}
            onPress={() => handleSelectedLetterClick(letter, index)}
          />
        ))}
        {emptyButtons.slice(answerLetters.length).map((_, index) => (
          <LetterButton color="secondary" key={index} filled={false} />
        ))}
      </View>

      <View style={styles.optionsContainer}>
        <View style={styles.topRow}>
          {optionLetters.slice(0, difficultyLength / 2).map((title, index) => (
            <LetterButton
              key={index}
              title={title}
              selected={isSelected[index]}
              onPress={() => handleLetterButtonClick(title, index)}
            />
          ))}
        </View>

        <View style={styles.secondRow}>
          {optionLetters
            .slice(difficultyLength / 2, difficultyLength)
            .map((title, index) => (
              <LetterButton
                key={index + difficultyLength / 2}
                title={title}
                selected={isSelected[index + difficultyLength / 2]}
                onPress={() =>
                  handleLetterButtonClick(title, index + difficultyLength / 2)
                }
              />
            ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Button color="primary" title="Give up" onPress={() => onGameOver()} />
        <View style={styles.helpButtonContainer}>
          <Button
            title="I need help"
            disabled={game.requested_help}
            reward="2"
            onPress={onRequestHelp}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapperStyles: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  optionsContainer: {
    gap: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  topRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 5,
  },
  secondRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  bottomContainer: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  helpButtonContainer: {
    width: "65%",
    flexDirection: "row",
  },
});

export default LetterBoard;
