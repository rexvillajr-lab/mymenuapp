import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useMenuStore } from '../store/menuStore';
import { CartLine, MenuItem } from '../types/models';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

type CartRowProps = {
  line: CartLine;
  onAdd: (line: CartLine) => void;
  onRemove: (line: CartLine) => void;
};

function CartRow({ line, onAdd, onRemove }: CartRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.itemText}>
        <Text style={styles.name}>{line.item.name}</Text>
        <Text style={styles.meta}>
          {line.quantity} x {formatCurrency(line.item.price)}
        </Text>
        <Text style={styles.lineTotal}>
          Line total {formatCurrency(line.item.price * line.quantity)}
        </Text>
      </View>
      <View style={styles.quantityControls}>
        <Pressable
          accessibilityLabel={`Remove ${line.item.name}`}
          style={styles.iconButton}
          onPress={() => onRemove(line)}
        >
          <Text style={styles.iconText}>-</Text>
        </Pressable>
        <Text style={styles.quantity}>{line.quantity}</Text>
        <Pressable
          accessibilityLabel={`Add ${line.item.name}`}
          style={styles.iconButton}
          onPress={() => onAdd(line)}
        >
          <Text style={styles.iconText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

type PickerRowProps = {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
};

function PickerRow({ item, quantity, onAdd }: PickerRowProps) {
  return (
    <View style={styles.pickerRow}>
      <View style={styles.itemText}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{formatCurrency(item.price)}</Text>
        {quantity > 0 ? (
          <Text style={styles.inOrder}>{quantity} in current order</Text>
        ) : null}
      </View>
      <Pressable
        accessibilityLabel={`Add ${item.name} to order`}
        style={styles.addItemButton}
        onPress={() => onAdd(item)}
      >
        <Text style={styles.addItemButtonText}>Add</Text>
      </Pressable>
    </View>
  );
}

export function CreateOrderScreen() {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const {
    addToCart,
    cart,
    clearCart,
    isLoading,
    items,
    placeOrder,
    removeFromCart,
  } = useMenuStore();
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
        renderItem={({ item }) => (
          <CartRow
            line={item}
            onAdd={line => addToCart(line.item)}
            onRemove={line => removeFromCart(line.item.id)}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Create Order</Text>
              <Text style={styles.subtitle}>
                Add items, then review quantities before saving the order.
              </Text>
            </View>
            <Pressable
              style={styles.newButton}
              onPress={() => setIsPickerVisible(true)}
            >
              <Text style={styles.newButtonText}>Add Item</Text>
            </Pressable>
          </View>
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptyText}>
              Tap Add Item to choose from your menu.
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
            onPress={clearCart}
          >
            <Text style={styles.secondaryButtonText}>Clear</Text>
          </Pressable>
          <Pressable
            disabled={lines.length === 0 || isLoading}
            style={[styles.primaryButton, lines.length === 0 && styles.muted]}
            onPress={placeOrder}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Saving...' : 'Place Order'}
            </Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.headerText}>
                <Text style={styles.formTitle}>Add Menu Item</Text>
                <Text style={styles.subtitle}>
                  Pick an item to add it to the current order.
                </Text>
              </View>
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setIsPickerVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </Pressable>
            </View>
            <FlatList
              contentContainerStyle={styles.pickerContent}
              data={items}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <PickerRow
                  item={item}
                  quantity={cart[item.id]?.quantity ?? 0}
                  onAdd={addToCart}
                />
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No menu items</Text>
                  <Text style={styles.emptyText}>
                    Create menu items before adding them to an order.
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addItemButton: {
    alignItems: 'center',
    backgroundColor: '#06d6a0',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 68,
    paddingHorizontal: 14,
  },
  addItemButtonText: {
    color: '#073b4c',
    fontWeight: '800',
  },
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
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
    marginBottom: 4,
    backgroundColor: '#ffffff',
  },
  headerText: {
    flex: 1,
    gap: 4,
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
  inOrder: {
    color: '#26547c',
    fontSize: 12,
    fontWeight: '800',
  },
  lineTotal: {
    color: '#334e68',
    fontSize: 12,
    fontWeight: '700',
  },
  meta: {
    color: '#627d98',
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    gap: 12,
    maxHeight: '78%',
    padding: 18,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  modalOverlay: {
    backgroundColor: 'rgba(16, 42, 67, 0.46)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  muted: {
    opacity: 0.45,
  },
  name: {
    color: '#102a43',
    fontSize: 16,
    fontWeight: '700',
  },
  newButton: {
    alignItems: 'center',
    backgroundColor: '#26547c',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },
  newButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  pickerContent: {
    gap: 10,
  },
  pickerRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
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
  formTitle: {
    color: '#102a43',
    fontSize: 17,
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
