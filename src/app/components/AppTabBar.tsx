import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {AppTab} from '../types/navigation';

const tabs: {key: AppTab; label: string}[] = [
  {key: 'items', label: 'Items'},
  {key: 'order', label: 'Create Order'},
  {key: 'orders', label: 'Orders'},
];

type Props = {
  activeTab: AppTab;
  onChange: (tab: AppTab) => void;
};

export function AppTabBar({activeTab, onChange}: Props) {
  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            accessibilityRole="button"
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[styles.tab, isActive && styles.activeTab]}>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  activeLabel: {
    color: '#ffffff',
    fontWeight: '700',
  },
  activeTab: {
    backgroundColor: '#26547c',
  },
  container: {
    backgroundColor: '#edf2f7',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 6,
    padding: 4,
  },
  label: {
    color: '#2d3748',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  tab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
