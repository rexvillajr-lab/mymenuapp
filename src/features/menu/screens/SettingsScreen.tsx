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

import { useTheme } from '../../../app/context/ThemeContext';

export function SettingsScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const closeModal = () => setIsModalVisible(false);

  return (
    <View>
      {/* Settings Button */}
      <TouchableOpacity
        style={[styles.settingsButton, { backgroundColor: colors.button }]}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={{ color: colors.buttonText }}>⚙</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
        {/* Overlay */}
        <View
          style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}
        >
          {/* Modal Card */}
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.modalBackground },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Settings
              </Text>

              <View style={styles.formActions}>
                <Pressable
                  style={[
                    styles.secondaryButton,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={closeModal}
                >
                  <Text style={{ color: colors.text }}>Close</Text>
                </Pressable>
              </View>
            </View>

            {/* Preferences */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Preferences
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.row}>
                <Text style={{ color: colors.text }}>Dark Mode</Text>
                <Switch
                  style={styles.switch}
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                />
              </View>
            </View>

            {/* Legal */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Legal
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.row}>
                <Text style={{ color: colors.text }}>Privacy Policy</Text>
              </View>

              <View style={[styles.row, { marginTop: 12 }]}>
                <Text style={{ color: colors.text }}>Terms of Service</Text>
              </View>
            </View>

            {/* About */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.row}>
                <Text style={{ color: colors.text }}>Version</Text>
                <Text style={{ color: colors.textSecondary }}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '95%',
    height: '90%',
    borderRadius: 12,
    padding: 20,
  },

  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 12,
  },

  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  settingsButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  secondaryButton: {
    borderRadius: 6,
    minHeight: 34,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
