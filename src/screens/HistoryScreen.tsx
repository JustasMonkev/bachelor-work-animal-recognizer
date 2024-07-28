import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationProp} from '../components/AppNavigator.tsx';

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation<RootNavigationProp>();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('animalHistory');
      const historyArray = historyData ? JSON.parse(historyData) : [];
      const uniqueHistory = historyArray.reduce((acc: any, current: any) => {
        const x = acc.find((item: any) => item.imagePath === current.imagePath);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      setHistory(uniqueHistory);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  const handleCardPress = (animalInfo: any) => {
    console.log(animalInfo.imagePath);
    navigation.navigate('AnimalInfoScreen', {
      imagePath: animalInfo.imagePath,
      animalInfo: animalInfo,
    });
  };

  return (
    <ScrollView style={styles.container}>
      {history.map((item: any, index) => (
        <TouchableOpacity
          key={index}
          style={styles.cardContainer}
          onPress={() => handleCardPress(item)}>
          <View style={styles.card}>
            <Image source={{uri: item.imagePath}} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.commonName}>{item.commonName}</Text>
              <Text style={styles.scientificName}>{item.scientificName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F3',
  },
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#FFF',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 20,
  },
  commonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 5,
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#4A5568',
    textAlign: 'center',
  },
});

export default HistoryScreen;
