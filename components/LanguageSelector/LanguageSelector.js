import React from 'react';
import { View, Button } from 'react-native';
import i18n from '../../config/locales/i18n';

const LanguageSelector = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <Button title="العربية" onPress={() => i18n.changeLanguage('ar')} />
      <Button title="Français" onPress={() => i18n.changeLanguage('fr')} />
    </View>
  );
};

export default LanguageSelector;
