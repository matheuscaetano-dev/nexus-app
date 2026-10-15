import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Icone({ name, size = 20, color = '#0E5B63', style }) {
  return <Ionicons name={name} size={size} color={color} style={style} accessible={false} importantForAccessibility="no" />;
}
