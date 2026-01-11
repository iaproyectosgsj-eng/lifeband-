import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants';

// Props for the searchable dropdown.
interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
}

// Dropdown that opens a modal list for quick selection on mobile.
const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar opción',
  label,
}) => {
  const [showModal, setShowModal] = useState(false);
  
  // Sort options alphabetically for easier browsing.
  const sortedOptions = [...options].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

  // Select an option and close the modal.
  const handleSelect = (option: string) => {
    onChange(option);
    setShowModal(false);
  };

  // Open the modal.
  const handleOpen = () => {
    setShowModal(true);
  };

  const displayText = value || placeholder;

  // Render a selectable option row.
  const renderOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.optionItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.optionText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={handleOpen}
      >
        <Text style={styles.dropdownText} numberOfLines={1}>
          {displayText}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Opción</Text>
            
            <View style={styles.optionsContainer}>
              {sortedOptions.length > 0 ? (
                <FlatList
                  data={sortedOptions}
                  renderItem={renderOption}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  style={styles.optionsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>No hay opciones disponibles</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    backgroundColor: Colors.card,
  },
  dropdownText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  dropdownArrow: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    ...Typography.title,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  optionsContainer: {
    flex: 1,
    marginBottom: Spacing.lg,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    ...Typography.body,
    color: Colors.text,
  },
  noResults: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noResultsText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
  },
  closeButtonText: {
    ...Typography.body,
    color: Colors.background,
    fontWeight: '600',
  },
});

export default SearchableDropdown;
