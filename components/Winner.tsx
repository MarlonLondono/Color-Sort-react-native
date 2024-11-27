import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

import ImageWinner from "../assets/winner.png";
import BackBtn from "../assets/BackBtn.png";
import NewGame from "../assets/NewPlayBtn.png";
import StreakPlus from "../assets/streakPlus.png";

interface PropsWinner {
  winner: Boolean;
  back: () => void;
  newGame: () => void;
}

export const Winner = ({ winner, back, newGame }: PropsWinner) => {
  if (!winner) return null;

  return (
    <View style={styles.winner}>
      <View style={styles.text}>
        <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut />
        <View style={styles.winTop}>
          <Image
            source={ImageWinner}
            style={[styles.image, { marginLeft: 8 }]}
          />
        </View>
        <View style={styles.win}>
          <Image source={StreakPlus} style={styles.image} />
        </View>
        <View style={styles.containerButtons}>
          <TouchableOpacity style={styles.containerBack} onPress={back}>
            <Image source={BackBtn} style={styles.image} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.containerBack} onPress={newGame}>
            <Image source={NewGame} style={styles.image} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  winner: {
    zIndex: 2000,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  text: {
    position: "relative",
    backgroundColor: "#FFF",
    width: 300,
    height: 300,
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    color: "#fff",
  },
  winTop: {
    position: "absolute",
    top: -210,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "130%",
    height: "115%",
  },
  win: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "70%",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  containerButtons: {
    position: "absolute",
    bottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  containerBack: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "49%",
    height: 48,
  },
});
