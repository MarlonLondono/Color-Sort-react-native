import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import styled from "styled-components/native";

const ContainerBottle = styled(View)`
  position: relative;
  display: flex;
  align-items: center;
  margin: 5px;
  width: 50px;
  height: 160px;
`;

const BottleContainer = styled(TouchableOpacity)`
  display: flex;
  flex-direction: column-reverse;
  width: 90%;
  height: 100%;
  border: 2px solid #000;
  border-radius: 25px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  overflow: hidden;
  margin: 0 10px;
  background-color: #e0e0e0;
`;

const NozzleBottle = styled(View)`
  position: absolute;
  top: 0;
  width: 100%;
  height: 14px;
  border: 2px solid #000;
  border-bottom-width: 0;
  border-radius: 20px;
  background-color: #e0e0e0;
  z-index: 1;
`;

const ColorLayer = styled(View)`
  height: 25%;
  width: 100%;
`;

interface BottleProps {
  colors: Array<string>;
  onPress: () => void;
  isSelected?: boolean;
}

const Bottle = ({ colors, onPress, isSelected }: BottleProps) => {
  return (
    <ContainerBottle>
      <NozzleBottle style={isSelected && { top: -10, width: "110%"}} />
      <BottleContainer onPress={onPress} style={[isSelected && styles.selectedBottle]}>
        {colors.map((color, index) => (
          <ColorLayer key={index} style={{ backgroundColor: color }} />
        ))}
      </BottleContainer>
    </ContainerBottle>
  );
};

const styles = StyleSheet.create({
  selectedBottle: {
    borderColor: '#FFF',
    borderWidth: 2,
    transform: [{ scale: 1.1 }]
  }
});

export default Bottle;
