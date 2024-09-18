import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import SearchableDropdown from 'react-native-searchable-dropdown';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { getStorage} from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../config";
import { useNavigation } from "@react-navigation/native";
import ArabicText from '../ArabicText/ArabicText';
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

  const placeholder =  <ArabicText text={'بحث عن الفئات '} ></ArabicText>

  return (
    <View>
      
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
      placeholder="بحث عن الفئات"
      resetValue={false}
      underlineColorAndroid="transparent"
    />
    
    </View>
  

  );
};

const styles = StyleSheet.create({
  searchDropdownContainer: {
    padding: 10,
  },
  searchDropdownInput: {
    padding: 15,
    borderColor: '#000', // Bold black border
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000', // Add shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,  
    width:250,
    height:45,
    textAlign: 'right',          // Align text to the right
    writingDirection: 'rtl', 
  },
  searchDropdownItem: {
    padding: 3,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  searchDropdownItemText: {
    fontSize: 16,
    textAlign: 'right',          // Align text to the right
    writingDirection: 'rtl',
  },
  searchDropdownItemsContainer: {
    maxHeight: 150,
  }
});

export default CategorySearchDropdown;
