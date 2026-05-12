import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useMenuStore } from '../store/menuStore';
import { MenuItem } from '../types/models';
import { useTheme } from '../../../app/context/ThemeContext';

const formatCurrency = (value: number) => `₱${value.toFixed(2)}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

function ItemRow({
  item,
  onDelete,
  onEdit,
}: {
  item: MenuItem;
  onDelete: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
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
        <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>

        <Text style={[styles.price, { color: colors.text }]}>
          {formatCurrency(item.price)}
        </Text>
        {/* <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          Created {formatDate(item.createdAt)}
        </Text>

        <Text style={[styles.dateText, { color: colors.textSecondary }]}>
          Updated {formatDate(item.updatedAt)}
        </Text> */}
      </View>

      <View style={styles.priceColumn}>
        <View style={styles.rowActions}>
          <Pressable
            style={[styles.secondaryButton, { backgroundColor: colors.button }]}
            onPress={() => onEdit(item)}
          >
            <Text style={{ color: colors.buttonText }}>Edit</Text>
          </Pressable>

          <Pressable
            style={[
              styles.deleteButton,
              { backgroundColor: colors.deleteButton },
            ]}
            onPress={() => onDelete(item)}
          >
            <Text
              style={[
                styles.deleteButtonText,
                { color: colors.deleteButtonText },
              ]}
            >
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function ItemsScreen() {
  const { colors } = useTheme();

  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { createMenuItem, deleteMenuItem, isLoading, items, updateMenuItem } =
    useMenuStore();

  const resetForm = () => {
    setEditingItemId(null);
    setItemName('');
    setItemPrice('');
  };

  const closeModal = () => {
    resetForm();
    setIsModalVisible(false);
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const openEditModal = (item: MenuItem) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemPrice(String(item.price));
    setIsModalVisible(true);
  };

  const saveItem = async () => {
    const normalizedName = itemName.trim();
    const parsedPrice = Number(itemPrice);

    if (!normalizedName || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Invalid item', 'Enter an item name and a price above 0.');
      return;
    }

    try {
      if (editingItemId) {
        await updateMenuItem(editingItemId, {
          name: normalizedName,
          price: parsedPrice,
        });
      } else {
        await createMenuItem({
          name: normalizedName,
          price: parsedPrice,
        });
      }

      closeModal();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to save item.';
      Alert.alert('Save failed', message);
    }
  };

  const confirmDelete = (item: MenuItem) => {
    Alert.alert('Delete item', `Delete ${item.name}?`, [
      { style: 'cancel', text: 'Cancel' },
      {
        style: 'destructive',
        text: 'Delete',
        onPress: () => deleteMenuItem(item.id),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        contentContainerStyle={styles.content}
        data={items}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <ItemRow
            item={item}
            onDelete={confirmDelete}
            onEdit={openEditModal}
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
                Menu Items
              </Text>

              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Created items are listed here for ordering.
              </Text>
            </View>

            <Pressable
              style={[styles.newButton, { backgroundColor: colors.button }]}
              onPress={openCreateModal}
            >
              <Text style={{ color: colors.buttonText }}>New Item</Text>
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
              Create your first menu item to start taking orders.
            </Text>
          </View>
        }
      />

      {/* MODAL */}
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
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
            <Text style={[styles.formTitle, { color: colors.text }]}>
              {editingItemId ? 'Update Item' : 'Create Item'}
            </Text>

            <TextInput
              autoFocus
              placeholder="Item name"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
              value={itemName}
              onChangeText={setItemName}
            />

            <TextInput
              keyboardType="decimal-pad"
              placeholder="Price"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
              value={itemPrice}
              onChangeText={setItemPrice}
            />

            <View style={styles.formActions}>
              <Pressable
                style={[
                  styles.deleteButton,
                  { backgroundColor: colors.deleteButton },
                ]}
                onPress={closeModal}
              >
                <Text style={{ color: colors.deleteButtonText }}>Cancel</Text>
              </Pressable>

              <Pressable
                disabled={isLoading}
                style={[
                  styles.saveButton,
                  { backgroundColor: colors.button },
                  isLoading && styles.muted,
                ]}
                onPress={saveItem}
              >
                <Text style={{ color: colors.buttonText }}>
                  {editingItemId ? 'Update' : 'Create'}
                </Text>
              </Pressable>
            </View>
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
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
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
  },

  itemText: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },

  name: {
    fontSize: 17,
    fontWeight: '700',
  },

  dateText: {
    fontSize: 12,
    lineHeight: 18,
  },

  price: {
    fontSize: 15,
    //fontWeight: '800',
  },

  priceColumn: {
    alignItems: 'flex-end',
    gap: 8,
  },

  rowActions: {
    alignItems: 'flex-end',
    gap: 6,
  },

  newButton: {
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },

  secondaryButton: {
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 65,
    paddingHorizontal: 12,
    alignItems: 'center',
  },

  deleteButton: {
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 34,
    minWidth: 65,
    paddingHorizontal: 12,
  },

  deleteButtonText: {
    fontWeight: '800',
  },

  saveButton: {
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 92,
    paddingHorizontal: 14,
    alignItems: 'center',
  },

  muted: {
    opacity: 0.5,
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
    gap: 12,
    padding: 18,
    width: '100%',
  },

  formTitle: {
    fontSize: 17,
    fontWeight: '800',
  },

  input: {
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 44,
    paddingHorizontal: 12,
  },

  formActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});
