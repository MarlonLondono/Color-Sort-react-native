import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import ImageBack from "./assets/background.png";
import Title from "./assets/icon.png";
import PlayBtn from "./assets/playBtn.png";
import GameScreen from "./screens/GameScreen";

type Screen = "Home" | "Play";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("Home");

  useEffect(() => {
    checkSavedGame();
  }, []);

  const checkSavedGame = async () => {
    try {
      const savedBottles = await AsyncStorage.getItem('bottles');
      if (savedBottles) {
        setCurrentScreen("Play");
      }
    } catch (error) {
      console.error('Error checking saved game:', error);
    }
  };

  const navigateToScreen = async (screen: Screen) => {
    if (screen === "Home") {
      try {
        await AsyncStorage.removeItem('bottles');
      } catch (error) {
        console.error('Error clearing saved game:', error);
      }
    }
    setCurrentScreen(screen);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.main}>
        {currentScreen === "Home" && (
          <ImageBackground source={ImageBack} style={styles.imageBack}>
            <View style={styles.containerTitle}>
              <Image source={Title} style={styles.image} />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigateToScreen("Play")}
            >
              <Image source={PlayBtn} style={styles.image} />
            </TouchableOpacity>
          </ImageBackground>
        )}
        {currentScreen === "Play" && (
          <GameScreen navigateToScreen={navigateToScreen} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerTitle: {
    marginTop: 200,
    marginHorizontal: "10%",
    width: "80%",
    height: 90,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  imageBack: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    position: "absolute",
    bottom: 100,
    marginHorizontal: "25%",
    width: "50%",
    height: 70,
  },
});
