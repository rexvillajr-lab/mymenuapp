import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppTabBar } from './components/AppTabBar';
import { AppTab } from './types/navigation';
import { CreateOrderScreen } from '../features/menu/screens/CreateOrderScreen';
import { ItemsScreen } from '../features/menu/screens/ItemsScreen';
import { OrdersScreen } from '../features/menu/screens/OrdersScreen';
import { useMenuStore } from '../features/menu/store/menuStore';
import { SettingsScreen } from '../features/menu/screens/SettingsScreen';

import { useTheme } from '../app/context/ThemeContext';

export function AppNavigator() {
  const [activeTab, setActiveTab] = useState<AppTab>('items');
  const { error, hasInitialized, initialize, isLoading } = useMenuStore();

  const { colors } = useTheme();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: colors.text }]}>
          My Menu App
        </Text>

        {/* Settings Button (already themed inside its own file) */}
        <SettingsScreen />
      </View>

      {/* TAB BAR */}
      <AppTabBar activeTab={activeTab} onChange={setActiveTab} />

      {/* ERROR */}
      {error ? (
        <View
          style={[
            styles.error,
            {
              backgroundColor: colors.button,

              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ color: colors.text }}>{error}</Text>
        </View>
      ) : null}

      {/* LOADING */}
      {isLoading && !hasInitialized ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.buttonText} />

          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading local menu...
          </Text>
        </View>
      ) : (
        <View style={styles.screen}>
          {activeTab === 'items' && <ItemsScreen />}
          {activeTab === 'order' && <CreateOrderScreen />}
          {activeTab === 'orders' && <OrdersScreen />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  appTitle: {
    fontSize: 30,
    fontWeight: '900',
  },

  error: {
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    padding: 10,
  },

  loading: {
    alignItems: 'center',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },

  loadingText: {
    fontWeight: '600',
  },

  screen: {
    flex: 1,
  },
});
