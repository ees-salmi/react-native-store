import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../config";
import { useNavigation } from "@react-navigation/native";
const app = initializeApp(firebaseConfig);
const storage =  getStorage(app);
const db = getFirestore(app);

const CategorySearchDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
    const navigation = useNavigation();
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "category"));
      const categories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categories);
      setFilteredCategories(categories); // Set initially with all categories
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleProductPress = (selectedItem) => {
    const categoryName = selectedItem.name;
    navigation.navigate("categories", { categoryName });
  };

  const handleSearchTextChange = (text) => {
    setSearchText(text);

    // Filter categories based on search text
    const filtered = categories.filter(item =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SearchableDropdown
      onTextChange={handleSearchTextChange}
      onItemSelect={handleProductPress}
      defaultIndex={0}
      containerStyle={styles.searchDropdownContainer}
      textInputStyle={styles.searchDropdownInput}
      itemStyle={styles.searchDropdownItem}
      itemTextStyle={styles.searchDropdownItemText}
      itemsContainerStyle={styles.searchDropdownItemsContainer}
      items={filteredCategories.map(category => ({
        id: category.id,
        name: category.title
      }))}
      placeholder="Search Categories..."
      resetValue={false}
      underlineColorAndroid="transparent"
    />
  );
};

const styles = StyleSheet.create({
  searchDropdownContainer: {
    padding: 10,
  },
  searchDropdownInput: {
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width:250,
    height:45,
  },
  searchDropdownItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  searchDropdownItemText: {
    fontSize: 16,
  },
  searchDropdownItemsContainer: {
    maxHeight: 150,
  }
});

export default CategorySearchDropdown;
