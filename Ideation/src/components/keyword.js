import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Remove from 'react-native-vector-icons/Feather';
const Keyword = ({name, remove}) => {
  const removeKeyword = () => {
    remove(name);
  };
  return (
    <View style={styles.keyword}>
      <Text style={styles.keywordname}>{name}</Text>
      <TouchableOpacity onPress={removeKeyword}>
        <Remove name="x" size={18} style={styles.deletebutton} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  keyword: {
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: '#FDF8FF',
    width: 94,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: 8,
    fontFamily: 'SB_Aggro_B',
  },
  keywordname: {
    fontSize: 16,
    paddingRight: 10,
    fontFamily: 'SB_Aggro_M',
  },
});
export default Keyword;
