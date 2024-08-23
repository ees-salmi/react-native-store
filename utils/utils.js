export const filterArray = ( array, searchTerm ) => {
    return array.filter(fruit => fruit.includes(searchTerm))
};

export const removeElement = ( array, element ) => {
    return array.splice(array.indexOf(element),1);
};
