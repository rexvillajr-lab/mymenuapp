import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Switch,
  Pressable,
} from 'react-native';

export function SettingsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.settingsButtonText}>⚙</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.container}>
          <View style={styles.modalCard}>
            <View style={styles.header}>
              <Text style={styles.title}>Settings</Text>
              <View style={styles.formActions}>
                <Pressable style={styles.secondaryButton} onPress={closeModal}>
                  <Text style={styles.secondaryButtonText}>Close</Text>
                </Pressable>
              </View>
            </View>

            <Text style={styles.themeText}>Preferences</Text>

            <View style={styles.card}>
              <View style={styles.header}>
                <Text>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={setDarkMode} />
              </View>
            </View>

            <Text style={styles.themeText}>Legal</Text>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text>Privacy Policy</Text>
                <Text>Terms of Service</Text>
              </View>
            </View>

            <Text style={styles.themeText}>About</Text>

            <View style={styles.card}>
              <View style={styles.header}>
                <Text>Version</Text>
                <Text>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    width: '95%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  settingsButton: {
    alignItems: 'center',
    backgroundColor: '#26547c',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  settingsButtonText: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#26547c',
    borderRadius: 10,
    height: 40,
    justifyContent: 'center',
    width: 40,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  themeText: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3, // Android shadow
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
  formActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
});
