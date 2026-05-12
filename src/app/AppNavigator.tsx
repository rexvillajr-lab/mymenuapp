import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { AppTabBar } from './components/AppTabBar';
import { AppTab } from './types/navigation';
import { CreateOrderScreen } from '../features/menu/screens/CreateOrderScreen';
import { ItemsScreen } from '../features/menu/screens/ItemsScreen';
import { OrdersScreen } from '../features/menu/screens/OrdersScreen';
import { useMenuStore } from '../features/menu/store/menuStore';
import { SettingsScreen } from '../features/menu/screens/SettingsScreen';

export function AppNavigator() {
  const [activeTab, setActiveTab] = useState<AppTab>('items');
  const { error, hasInitialized, initialize, isLoading } = useMenuStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>My Menu App</Text>
        {/* Settings Button */}
        <SettingsScreen />
      </View>
      <AppTabBar activeTab={activeTab} onChange={setActiveTab} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {isLoading && !hasInitialized ? (
        <View style={styles.loading}>
          <ActivityIndicator color="#26547c" />
          <Text style={styles.loadingText}>Loading local menu...</Text>
        </View>
      ) : (
        <View style={styles.screen}>
          {activeTab === 'items' ? <ItemsScreen /> : null}
          {activeTab === 'order' ? <CreateOrderScreen /> : null}
          {activeTab === 'orders' ? <OrdersScreen /> : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appTitle: {
    color: '#102a43',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 10,
  },
  container: {
    backgroundColor: '#f6f8fb',
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  error: {
    backgroundColor: '#ffe3e3',
    borderColor: '#ffa8a8',
    borderRadius: 8,
    borderWidth: 1,
    color: '#c92a2a',
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
    color: '#627d98',
    fontWeight: '600',
  },
  screen: {
    flex: 1,
  },
});
