import React from 'react';
import { View, ViewProps, useColorScheme } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...props }: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
        },
        style,
      ]}
      {...props}
    />
  );
}

export default ThemedView;