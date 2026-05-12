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
import { useTheme } from '../../../app/context/ThemeContext';

const formatCurrency = (value: number) => `₱${value.toFixed(2)}`;

function CartRow({
  line,
  onAdd,
  onRemove,
}: {
  line: CartLine;
  onAdd: (line: CartLine) => void;
  onRemove: (line: CartLine) => void;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.itemText}>
        <Text style={[styles.name, { color: colors.text }]}>
          {line.item.name}
        </Text>

        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {line.quantity} x {formatCurrency(line.item.price)}
        </Text>

        <Text style={[styles.lineTotal, { color: colors.textSecondary }]}>
          Line total {formatCurrency(line.item.price * line.quantity)}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <Pressable
          style={[styles.iconButton, { backgroundColor: colors.deleteButton }]}
          onPress={() => onRemove(line)}
        >
          <Text style={{ color: colors.deleteButtonText }}>-</Text>
        </Pressable>

        <Text style={[styles.quantity, { color: colors.text }]}>
          {line.quantity}
        </Text>

        <Pressable
          style={[styles.iconButton, { backgroundColor: colors.button }]}
          onPress={() => onAdd(line)}
        >
          <Text style={{ color: colors.buttonText }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PickerRow({
  item,
  quantity,
  onAdd,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: (item: MenuItem) => void;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.pickerRow,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.itemText}>
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>

        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {formatCurrency(item.price)}
        </Text>

        {quantity > 0 ? (
          <Text style={[styles.inOrder, { color: colors.text }]}>
            {quantity} in current order
          </Text>
        ) : null}
      </View>

      <Pressable
        style={[styles.addItemButton, { backgroundColor: colors.button }]}
        onPress={() => onAdd(item)}
      >
        <Text style={{ color: colors.buttonText }}>Add</Text>
      </Pressable>
    </View>
  );
}

export function CreateOrderScreen() {
  const { colors } = useTheme();

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <View
            style={[
              styles.header,
              {
                backgroundColor: colors.background,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>
                Create Order
              </Text>

              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Add items, then review quantities before saving the order.
              </Text>
            </View>

            <Pressable
              style={[styles.newButton, { backgroundColor: colors.button }]}
              onPress={() => setIsPickerVisible(true)}
            >
              <Text style={{ color: colors.buttonText }}>Add Item</Text>
            </Pressable>
          </View>
        }
        stickyHeaderIndices={[0]}
        ListEmptyComponent={
          <View style={[styles.emptyState, { borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No items yet
            </Text>

            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tap Add Item to choose from your menu.
            </Text>
          </View>
        }
      />

      {/* SUMMARY */}
      <View
        style={[
          styles.summary,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Total
          </Text>

          <Text style={[styles.total, { color: colors.text }]}>
            {formatCurrency(total)}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            disabled={lines.length === 0 || isLoading}
            style={[
              styles.deleteButton,
              { backgroundColor: colors.deleteButton },
              // lines.length === 0 && styles.muted,
            ]}
            onPress={clearCart}
          >
            <Text style={{ color: colors.deleteButtonText }}>Clear</Text>
          </Pressable>

          <Pressable
            disabled={lines.length === 0 || isLoading}
            style={[
              styles.primaryButton,
              { backgroundColor: colors.button },
              // lines.length === 0 && styles.muted,
            ]}
            onPress={placeOrder}
          >
            <Text style={{ color: colors.buttonText }}>
              {isLoading ? 'Saving...' : 'Place Order'}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* MODAL */}
      <Modal
        animationType="fade"
        transparent
        visible={isPickerVisible}
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.modalOverlay },
          ]}
        >
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.modalBackground },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={styles.headerText}>
                <Text style={[styles.formTitle, { color: colors.text }]}>
                  Add Menu Item
                </Text>

                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  Pick an item to add it to the current order.
                </Text>
              </View>

              <Pressable
                style={[
                  styles.deleteButton,
                  { backgroundColor: colors.deleteButton },
                ]}
                onPress={() => setIsPickerVisible(false)}
              >
                <Text style={{ color: colors.deleteButtonText }}>Close</Text>
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
                <View
                  style={[styles.emptyState, { borderColor: colors.border }]}
                >
                  <Text style={[styles.emptyTitle, { color: colors.text }]}>
                    No menu items
                  </Text>

                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
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
  container: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  headerText: {
    flex: 1,
    gap: 4,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
  },

  subtitle: {},

  row: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },

  pickerRow: {
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  itemText: {
    flex: 1,
    gap: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
  },

  meta: {},

  lineTotal: {
    fontSize: 12,
    fontWeight: '700',
  },

  inOrder: {
    fontSize: 12,
    fontWeight: '800',
  },

  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  iconButton: {
    borderRadius: 6,
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantity: {
    fontSize: 16,
    fontWeight: '800',
    minWidth: 24,
    textAlign: 'center',
  },

  addItemButton: {
    borderRadius: 6,
    paddingHorizontal: 14,
    minHeight: 36,
    justifyContent: 'center',
  },

  newButton: {
    borderRadius: 6,
    paddingHorizontal: 14,
    minHeight: 40,
    justifyContent: 'center',
  },

  primaryButton: {
    borderRadius: 6,
    paddingHorizontal: 14,
    minHeight: 44,
    minWidth: 124,
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButton: {
    borderRadius: 6,
    paddingHorizontal: 14,
    minHeight: 34,
    minWidth: 78,
    justifyContent: 'center',
    alignItems: 'center',
  },

  summary: {
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  total: {
    fontSize: 22,
    fontWeight: '900',
  },

  actions: {
    flexDirection: 'row',
    gap: 8,
  },

  emptyState: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 6,
    padding: 24,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
  },

  emptyText: {
    textAlign: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    borderRadius: 8,
    padding: 18,
    maxHeight: '78%',
    width: '100%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  pickerContent: {
    gap: 10,
  },

  muted: {
    opacity: 0.45,
  },

  deleteButton: {
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },

  deleteButtonText: {
    fontWeight: '800',
  },
});
