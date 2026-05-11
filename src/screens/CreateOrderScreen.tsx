import React from 'react';
import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';

import {useMenuStore} from '../store/menuStore';
import {CartLine} from '../types/models';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

type CartRowProps = {
  line: CartLine;
  onAdd: (line: CartLine) => void;
  onRemove: (line: CartLine) => void;
};

function CartRow({line, onAdd, onRemove}: CartRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.itemText}>
        <Text style={styles.name}>{line.item.name}</Text>
        <Text style={styles.meta}>
          {line.quantity} x {formatCurrency(line.item.price)}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <Pressable
          accessibilityLabel={`Remove ${line.item.name}`}
          style={styles.iconButton}
          onPress={() => onRemove(line)}>
          <Text style={styles.iconText}>-</Text>
        </Pressable>
        <Text style={styles.quantity}>{line.quantity}</Text>
        <Pressable
          accessibilityLabel={`Add ${line.item.name}`}
          style={styles.iconButton}
          onPress={() => onAdd(line)}>
          <Text style={styles.iconText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function CreateOrderScreen() {
  const {addToCart, cart, clearCart, isLoading, placeOrder, removeFromCart} =
    useMenuStore();
  const lines = Object.values(cart);
  const total = lines.reduce(
    (sum, line) => sum + line.item.price * line.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={lines}
        keyExtractor={line => String(line.item.id)}
        renderItem={({item}) => (
          <CartRow
            line={item}
            onAdd={line => addToCart(line.item)}
            onRemove={line => removeFromCart(line.item.id)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Create Order</Text>
            <Text style={styles.subtitle}>
              Review quantities before saving the order offline.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptyText}>
              Go to Items and add something to start an order.
            </Text>
          </View>
        }
      />
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            disabled={lines.length === 0 || isLoading}
            style={[styles.secondaryButton, lines.length === 0 && styles.muted]}
            onPress={clearCart}>
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </Pressable>
          <Pressable
            disabled={lines.length === 0 || isLoading}
            style={[styles.primaryButton, lines.length === 0 && styles.muted]}
            onPress={placeOrder}>
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Saving...' : 'Place Order'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 16,
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
    textAlign: 'center',
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
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 6,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  iconText: {
    color: '#102a43',
    fontSize: 20,
    fontWeight: '800',
  },
  itemText: {
    flex: 1,
    gap: 4,
  },
  meta: {
    color: '#627d98',
  },
  muted: {
    opacity: 0.45,
  },
  name: {
    color: '#102a43',
    fontSize: 16,
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#26547c',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 124,
    paddingHorizontal: 14,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  quantity: {
    color: '#102a43',
    fontSize: 16,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },
  quantityControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  row: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 78,
    paddingHorizontal: 14,
  },
  secondaryButtonText: {
    color: '#102a43',
    fontWeight: '800',
  },
  subtitle: {
    color: '#627d98',
  },
  summary: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 14,
  },
  summaryLabel: {
    color: '#627d98',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#102a43',
    fontSize: 24,
    fontWeight: '800',
  },
  total: {
    color: '#102a43',
    fontSize: 22,
    fontWeight: '900',
  },
});
