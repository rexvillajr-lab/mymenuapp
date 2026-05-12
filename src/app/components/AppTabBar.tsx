import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppTab } from '../types/navigation';
import { useTheme } from '../../app/context/ThemeContext';

const tabs: { key: AppTab; label: string }[] = [
  { key: 'items', label: 'Items' },
  { key: 'order', label: 'Create Order' },
  { key: 'orders', label: 'Orders' },
];

type Props = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

export function AppTabBar({ activeTab, onChange }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            accessibilityRole="button"
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tab,
              isActive && {
                backgroundColor: colors.button,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: isActive ? colors.buttonText : colors.textSecondary,
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    padding: 4,
    marginTop: 12,
  },

  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

  label: {
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
});
