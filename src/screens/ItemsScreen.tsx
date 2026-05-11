import React, {useState} from 'react';
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

import {useMenuStore} from '../store/menuStore';
import {MenuItem} from '../types/models';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const formatDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));

type ItemRowProps = {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onEdit: (item: MenuItem) => void;
};

function ItemRow({item, onAdd, onDelete, onEdit}: ItemRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.itemText}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.dateText}>
          Created {formatDate(item.createdAt)}
        </Text>
        <Text style={styles.dateText}>
          Updated {formatDate(item.updatedAt)}
        </Text>
      </View>
      <View style={styles.priceColumn}>
        <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        <View style={styles.rowActions}>
          <Pressable style={styles.button} onPress={() => onAdd(item)}>
            <Text style={styles.buttonText}>Add</Text>
          </Pressable>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => onEdit(item)}
          >
            <Text style={styles.secondaryButtonText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.deleteButton} onPress={() => onDelete(item)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function ItemsScreen() {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    addToCart,
    createMenuItem,
    deleteMenuItem,
    isLoading,
    items,
    updateMenuItem,
  } = useMenuStore();

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
      {style: 'cancel', text: 'Cancel'},
      {
        style: 'destructive',
        text: 'Delete',
        onPress: () => deleteMenuItem(item.id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.content}
        data={items}
        extraData={items.length}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <ItemRow
            item={item}
            onAdd={addToCart}
            onDelete={confirmDelete}
            onEdit={openEditModal}
          />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Menu Items</Text>
              <Text style={styles.subtitle}>
                Created items are listed here for ordering.
              </Text>
            </View>
            <Pressable style={styles.newButton} onPress={openCreateModal}>
              <Text style={styles.newButtonText}>New Item</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptyText}>
              Create your first menu item to start taking orders.
            </Text>
          </View>
        }
      />

      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.formTitle}>
              {editingItemId ? 'Update Item' : 'Create Item'}
            </Text>
            <TextInput
              autoFocus
              placeholder="Item name"
              placeholderTextColor="#829ab1"
              style={styles.input}
              value={itemName}
              onChangeText={setItemName}
            />
            <TextInput
              keyboardType="decimal-pad"
              placeholder="Price"
              placeholderTextColor="#829ab1"
              style={styles.input}
              value={itemPrice}
              onChangeText={setItemPrice}
            />
            <View style={styles.formActions}>
              <Pressable style={styles.secondaryButton} onPress={closeModal}>
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                disabled={isLoading}
                style={[styles.saveButton, isLoading && styles.muted]}
                onPress={saveItem}
              >
                <Text style={styles.saveButtonText}>
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
  button: {
    alignItems: 'center',
    backgroundColor: '#06d6a0',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 14,
  },
  buttonText: {
    color: '#073b4c',
    fontWeight: '800',
  },
  content: {
    flexGrow: 1,
    gap: 10,
    paddingVertical: 16,
  },
  container: {
    flex: 1,
  },
  dateText: {
    color: '#5f6c7b',
    fontSize: 12,
    lineHeight: 18,
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: '#ffe3e3',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  deleteButtonText: {
    color: '#c92a2a',
    fontWeight: '800',
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  formTitle: {
    color: '#102a43',
    fontSize: 17,
    fontWeight: '800',
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
  input: {
    borderColor: '#bcccdc',
    borderRadius: 6,
    borderWidth: 1,
    color: '#102a43',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  itemText: {
    flex: 1,
    gap: 4,
    paddingRight: 12,
  },
  muted: {
    opacity: 0.45,
  },
  name: {
    color: '#102a43',
    fontSize: 17,
    fontWeight: '700',
  },
  price: {
    color: '#102a43',
    fontSize: 15,
    fontWeight: '800',
  },
  priceColumn: {
    alignItems: 'flex-end',
    gap: 8,
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
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    gap: 12,
    padding: 18,
    width: '100%',
  },
  modalOverlay: {
    backgroundColor: 'rgba(16, 42, 67, 0.46)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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
  row: {
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
  },
  rowActions: {
    alignItems: 'flex-end',
    gap: 6,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: '#26547c',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 40,
    minWidth: 92,
    paddingHorizontal: 14,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: '#edf2f7',
    borderRadius: 6,
    justifyContent: 'center',
    minHeight: 34,
    paddingHorizontal: 12,
  },
  secondaryButtonText: {
    color: '#102a43',
    fontWeight: '800',
  },
  subtitle: {
    color: '#627d98',
  },
  title: {
    color: '#102a43',
    fontSize: 24,
    fontWeight: '800',
  },
});
