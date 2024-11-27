import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Button,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import Bottle from "../components/Bottle";
import ImageBack from "../assets/background.png";
import { Winner } from "../components/Winner";
import { GameBlocked } from "../components/GameBlocked";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Screen = "Home" | "Play";
type BottleColors = string[][];

const generateRandomBottles = (): BottleColors => {
  const colors = [
    "red",
    "red",
    "red",
    "red",
    "green",
    "green",
    "green",
    "green",
    "blue",
    "blue",
    "blue",
    "blue",
    "yellow",
    "yellow",
    "yellow",
    "yellow",
    "purple",
    "purple",
    "purple",
    "purple",
    "orange",
    "orange",
    "orange",
    "orange",
    "pink",
    "pink",
    "pink",
    "pink",
    "cyan",
    "cyan",
    "cyan",
    "cyan",
  ];

  const shuffledColors = colors.sort(() => Math.random() - 0.5);

  const bottles = [
    shuffledColors.slice(0, 4),
    shuffledColors.slice(4, 8),
    shuffledColors.slice(8, 12),
    shuffledColors.slice(12, 16),
    shuffledColors.slice(16, 20),
    shuffledColors.slice(20, 24),
    shuffledColors.slice(24, 28),
    shuffledColors.slice(28, 32),
    [], // Botella vacía 1
    [], // Botella vacía 2
  ];

  return bottles;
};

interface PropsGame {
  navigateToScreen: (screen: Screen) => void;
}

const GameScreen = ({ navigateToScreen }: PropsGame) => {
  const [bottles, setBottles] = useState<BottleColors>(generateRandomBottles());
  const [selectedBottle, setSelectedBottle] = useState<number | null>(null);
  const [winner, setWinner] = useState(false);
  const [gameBlocked, setGameBlocked] = useState(false);
  const [streak, setStreak] = useState<number>(0);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedStreak = await AsyncStorage.getItem('streak');
      const savedBottles = await AsyncStorage.getItem('bottles');
      
      if (savedStreak) setStreak(parseInt(savedStreak));
      if (savedBottles) setBottles(JSON.parse(savedBottles));
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  // Guardar el estado actual del juego
  const saveGameState = async () => {
    try {
      await AsyncStorage.setItem('bottles', JSON.stringify(bottles));
      await AsyncStorage.setItem('streak', streak.toString());
    } catch (error) {
      console.error('Error saving game state:', error);
    }
  };

  const back = async () => {
    navigateToScreen("Home");
  };

  const handleBottlePress = (index: number) => {
    if (selectedBottle === index) {
      // Si se presiona la misma botella, desactivar la selección
      setSelectedBottle(null);
      return;
    }
    
    if (selectedBottle === null) {
      // Si no hay botella seleccionada, seleccionar esta como origen
      setSelectedBottle(index);
    } else {
      // Si ya hay una botella seleccionada, intentar mover
      moveColor(selectedBottle, index);
      setSelectedBottle(null);
    }
  };

  const moveColor = async (fromIndex: number, toIndex: number) => {
    const fromBottle = [...bottles[fromIndex]];
    const toBottle = [...bottles[toIndex]];

    // Validación básica inicial
    if (
      fromBottle.length === 0 || // Botella de origen vacía
      toBottle.length === 4 // Botella destino llena
    ) {
      return;
    }

    // Contar cuántos colores iguales consecutivos hay en la parte superior
    let colorCount = 0;
    const colorToMove = fromBottle[fromBottle.length - 1];
    for (let i = fromBottle.length - 1; i >= 0; i--) {
      if (fromBottle[i] === colorToMove) {
        colorCount++;
      } else {
        break;
      }
    }

    // Validaciones adicionales
    if (
      (toBottle.length > 0 && toBottle[toBottle.length - 1] !== colorToMove) || // Colores diferentes
      (4 - toBottle.length) < colorCount // No hay espacio suficiente para TODOS los colores iguales
    ) {
      return;
    }

    // Mover TODOS los colores iguales consecutivos
    for (let i = 0; i < colorCount; i++) {
      toBottle.push(fromBottle.pop() as string);
    }

    const newBottles = [...bottles];
    newBottles[fromIndex] = fromBottle;
    newBottles[toIndex] = toBottle;

    setBottles(newBottles);
    await saveGameState();
    checkWinOrBlock(newBottles);
  };

  const checkWinOrBlock = async (bottles: BottleColors) => {
    // Verificar si se ganó
    const emptyBottles = bottles.filter((bottle) => bottle.length === 0);
    const isWon = bottles.every(
      (bottle) =>
        bottle.length === 0 || // Botella vacía es válida
        (bottle.length === 4 && new Set(bottle).size === 1) // Botella llena de un solo color
    );

    if (isWon && emptyBottles.length === 2) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setWinner(true);
      await AsyncStorage.setItem('streak', newStreak.toString());
    }

    // Verificar si el juego está bloqueado
    if (isGameBlocked(bottles)) {
      setGameBlocked(true);
      setStreak(0);
      await AsyncStorage.setItem('streak', '0');
    }
  };

  const isGameBlocked = (bottles: BottleColors): boolean => {
    for (let fromIndex = 0; fromIndex < bottles.length; fromIndex++) {
      for (let toIndex = 0; toIndex < bottles.length; toIndex++) {
        if (fromIndex !== toIndex) {
          const fromBottle = bottles[fromIndex];
          const toBottle = bottles[toIndex];

          // Si la botella origen está vacía, continuamos con la siguiente
          if (fromBottle.length === 0) continue;

          // Contamos colores iguales consecutivos en la botella origen
          let colorCount = 0;
          const colorToMove = fromBottle[fromBottle.length - 1];
          for (let i = fromBottle.length - 1; i >= 0; i--) {
            if (fromBottle[i] === colorToMove) {
              colorCount++;
            } else {
              break;
            }
          }

          // Condiciones para un movimiento válido
          if (
            toBottle.length < 4 && // Hay espacio en la botella destino
            (toBottle.length === 0 || // Botella destino vacía
              toBottle[toBottle.length - 1] === colorToMove) && // Colores coinciden
            (4 - toBottle.length) >= colorCount // Hay espacio suficiente para todos los colores iguales
          ) {
            return false; // Hay al menos un movimiento válido
          }
        }
      }
    }
    return true; // No hay movimientos válidos
  };

  const resetGame = () => {
    setBottles(generateRandomBottles());
    setSelectedBottle(null);
    setWinner(false);
    setGameBlocked(false);
  };

  return (
    <ImageBackground source={ImageBack} style={styles.container}>
      <View style={styles.containerBackAndStreak}>
        <TouchableOpacity onPress={back}>
          <Text>Volver</Text>
        </TouchableOpacity>
        <View style={styles.streak}>
          <Text style={styles.textStreak}>RACHA {streak}</Text>
        </View>
        <TouchableOpacity style={styles.containerRestart} onPress={resetGame}>
          <Text>Reiniciar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottleContainer}>
        {bottles.map((colors, index) => (
          <Bottle
            key={index}
            colors={colors}
            onPress={() => handleBottlePress(index)}
            isSelected={selectedBottle === index}
          />
        ))}
      </View>
      <Winner winner={winner} back={back} newGame={resetGame} />
      <GameBlocked block={gameBlocked} back={back} newGame={resetGame} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerBackAndStreak: {
    position: "absolute",
    top: 30,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
  },
  streak: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "#9F51FE",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  textStreak: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "900",
  },
  containerRestart: {
    width: "12%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bottleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "100%",
    padding: 10,
  },
});

export default GameScreen;
