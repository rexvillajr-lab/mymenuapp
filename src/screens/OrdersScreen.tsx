import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {useMenuStore} from '../store/menuStore';
import {Order} from '../types/models';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

function OrderRow({order}: {order: Order}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <View>
          <Text style={styles.name}>Order #{order.id}</Text>
          <Text style={styles.date}>{formatDate(order.createdAt)}</Text>
        </View>
        <Text style={styles.total}>{formatCurrency(order.total)}</Text>
      </View>
      <View style={styles.lines}>
        {order.items.map(item => (
          <Text key={item.id} style={styles.line}>
            {item.quantity} x {item.name}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function OrdersScreen() {
  const {orders} = useMenuStore();

  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={orders}
      keyExtractor={item => String(item.id)}
      renderItem={({item}) => <OrderRow order={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Created Orders</Text>
          <Text style={styles.subtitle}>Orders saved in local SQLite.</Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Created orders will appear here.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 16,
  },
  date: {
    color: '#627d98',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderStyle: 'dashed',
    borderWidth: 1,
    gap: 6,
    padding: 24,
  },
  emptyText: {
    color: '#627d98',
  },
  emptyTitle: {
    color: '#102a43',
    fontSize: 18,
    fontWeight: '800',
  },
  header: {
    gap: 4,
    marginBottom: 4,
  },
  line: {
    color: '#334e68',
    lineHeight: 20,
  },
  lines: {
    gap: 2,
    marginTop: 12,
  },
  name: {
    color: '#102a43',
    fontSize: 17,
    fontWeight: '800',
  },
  row: {
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  rowHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  subtitle: {
    color: '#627d98',
  },
  title: {
    color: '#102a43',
    fontSize: 24,
    fontWeight: '800',
  },
  total: {
    color: '#26547c',
    fontSize: 18,
    fontWeight: '900',
  },
});
