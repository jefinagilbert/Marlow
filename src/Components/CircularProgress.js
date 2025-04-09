import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CircularProgress = ({ percentage = 75, size = 100, strokeWidth = 10 }) => {
  const rightTransform = percentage > 50 ? 180 : (percentage / 50) * 180;
  const leftTransform = percentage > 50 ? ((percentage - 50) / 50) * 180 : 0;

  return (
    <View
      style={[
        styles.outerCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <View
        style={[
          styles.innerCircle,
          {
            width: size - strokeWidth * 2,
            height: size - strokeWidth * 2,
            borderRadius: (size - strokeWidth * 2) / 2,
            top: strokeWidth,
            left: strokeWidth,
          },
        ]}
      />

      {/* Right Half */}
      <View style={[styles.halfCircle, { right: size / 2 }]}>
        <View
          style={[
            styles.half,
            {
              width: size / 2,
              height: size,
              borderTopRightRadius: size / 2,
              borderBottomRightRadius: size / 2,
              transform: [{ rotateZ: `${rightTransform}deg` }],
              backgroundColor: '#3b82f6',
            },
          ]}
        />
      </View>

      {/* Left Half */}
      <View style={[styles.halfCircle, { left: size / 2 }]}>
        <View
          style={[
            styles.half,
            {
              width: size / 2,
              height: size,
              borderTopLeftRadius: size / 2,
              borderBottomLeftRadius: size / 2,
              transform: [{ rotateZ: `${leftTransform}deg` }],
              backgroundColor: percentage > 50 ? '#3b82f6' : 'transparent',
            },
          ]}
        />
      </View>

      {/* Percentage Text */}
      <View style={styles.center}>
        <Text style={styles.text}>{`${percentage}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerCircle: {
    position: 'relative',
    backgroundColor: '#e6e6e6',
  },
  innerCircle: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  halfCircle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '50%',
    overflow: 'hidden',
  },
  half: {
    position: 'absolute',
    top: 0,
  },
  center: {
    position: 'absolute',
    top: '35%',
    left: '35%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CircularProgress;