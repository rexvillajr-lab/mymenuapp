import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useMenuStore } from '../store/menuStore';
import { Order } from '../types/models';
import { useTheme } from '../../../app/context/ThemeContext';

const formatCurrency = (value: number) => `₱${value.toFixed(2)}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

function OrderRow({ order }: { order: Order }) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.rowHeader}>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>
            Order #{order.id}
          </Text>

          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(order.createdAt)}
          </Text>
        </View>

        <Text style={[styles.total, { color: colors.text }]}>
          {formatCurrency(order.total)}
        </Text>
      </View>

      <View style={styles.lines}>
        {order.items.map(item => (
          <Text
            key={item.id}
            style={[styles.line, { color: colors.textSecondary }]}
          >
            {item.quantity} x {item.name}
          </Text>
        ))}
      </View>
    </View>
  );
}

export function OrdersScreen() {
  const { orders } = useMenuStore();
  const { colors } = useTheme();

  return (
    <FlatList
      contentContainerStyle={[
        styles.content,
        { backgroundColor: colors.background },
      ]}
      data={orders}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => <OrderRow order={item} />}
      ListHeaderComponent={
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Order History
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Orders saved in local SQLite.
          </Text>
        </View>
      }
      stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View
          style={[
            styles.emptyState,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No orders yet
          </Text>

          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
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
    paddingHorizontal: 12,
  },

  header: {
    gap: 4,
    marginBottom: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 14,
  },

  row: {
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

  name: {
    fontSize: 17,
    fontWeight: '800',
  },

  date: {
    marginTop: 2,
  },

  total: {
    fontSize: 18,
    fontWeight: '900',
  },

  lines: {
    gap: 2,
    marginTop: 12,
  },

  line: {
    lineHeight: 20,
  },

  emptyState: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 6,
    padding: 24,
    marginTop: 20,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {},
});
