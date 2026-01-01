import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { Home, FileText, Music, HelpCircle, Menu } from 'lucide-react-native';

type TabConfig = {
  name: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
};

const BottomNav = () => {
  const navigation = useNavigation<NavigationProp<Record<string, object>>>();
  const route = useRoute();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const tabs: TabConfig[] = [
    { name: 'Dashboard', icon: Home, label: 'Home' },
    { name: 'Manuals', icon: FileText, label: 'Manuals' },
    { name: 'Hymns', icon: Music, label: 'Hymns' },
    { name: 'Quiz', icon: HelpCircle, label: 'Quiz' },
    { name: 'Menu', icon: Menu, label: 'More' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderTopColor: isDark ? '#27272a' : '#e4e4e7',
        },
      ]}
    >
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = route.name === tab.name;

          return (
            <Pressable
              key={tab.name}
              style={styles.tab}
              onPress={() => navigation.navigate(tab.name as never)}
            >
              <Icon
                size={20}
                color={
                  isActive
                    ? isDark
                      ? '#fafafa'
                      : '#09090b'
                    : isDark
                    ? '#71717a'
                    : '#a1a1aa'
                }
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? isDark
                        ? '#fafafa'
                        : '#09090b'
                      : isDark
                      ? '#71717a'
                      : '#a1a1aa',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    zIndex: 50,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    maxWidth: 896,
    marginHorizontal: 'auto',
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});

export default BottomNav;