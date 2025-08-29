import React, {useEffect} from 'react';
import {ScrollView, Image, StyleSheet, View} from 'react-native';
import {Card, Text} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnimalInfoScreenProps} from '../components/AppNavigator.tsx';
import {colors} from '../theme/colors';

interface SectionProps {
  title: string;
  data: Record<string, string | Record<string, string> | string[]> | string[];
}

type Size = {
  weight: string;
  height: string;
  length: string;
};

const AnimalInfoScreen: React.FC<AnimalInfoScreenProps> = ({route}) => {
  const {imagePath, animalInfo} = route.params;

  useEffect(() => {
    saveHistory(animalInfo);
  }, [animalInfo]);

  const saveHistory = async (info: {
    imagePath: string;
    commonName: string;
    scientificName: string;
    classification: Record<string, string>;
    characteristics: {
      habitat: string;
      diet: string;
      lifespan: string;
      size: {length: string; height: string; weight: string};
      color: string;
      distinctiveFeatures: string;
    };
    behaviors: Record<string, string>;
    conservationStatus: string;
    geographicalDistribution: Record<string, string | string[]>;
    observations: Record<string, string>;
  }) => {
    try {
      const history = await AsyncStorage.getItem('animalHistory');
      const historyArray = history ? JSON.parse(history) : [];
      historyArray.push(info);
      await AsyncStorage.setItem('animalHistory', JSON.stringify(historyArray));
    } catch (error) {
      console.error('Failed to save history:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{uri: `file://${imagePath}`}} style={styles.image} />
      <View style={styles.cardContainer}>
        <Text style={styles.commonName}>{animalInfo.commonName}</Text>
        <Text style={styles.scientificName}>{animalInfo.scientificName}</Text>
        <Card.Divider />
        <Section title="Classification" data={animalInfo.classification} />
        <Section title="Characteristics" data={animalInfo.characteristics} />
        <Section title="Behaviors" data={animalInfo.behaviors} />
        <Section
          title={'Conversation status'}
          data={[animalInfo.conservationStatus]}
        />
        <Section
          title="Geographical Distribution"
          data={animalInfo.geographicalDistribution}
        />
        <Section title="Observations" data={animalInfo.observations} />
      </View>
    </ScrollView>
  );
};

const Section: React.FC<SectionProps> = ({title, data}) => {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.section}>
        <Card.Title style={styles.sectionTitle}>{title}</Card.Title>
        {Object.entries(data).map(([key, value]) => {
          let displayValue = '';
          // Check if it's the size key and format it accordingly
          if (key === 'size' && typeof value === 'object' && value !== null) {
            displayValue = formatSize(value as Size);
          } else if (Array.isArray(value)) {
            displayValue = value.join(', ');
          } else {
            displayValue = value.toString();
          }
          return (
            <View key={key} style={styles.keyValueContainer}>
              <Text style={styles.keyText}>{`${key}: `}</Text>
              <Text style={styles.valueText}>{displayValue}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.sectionDivider} />
    </View>
  );
};

const formatSize = (size: Size) => {
  return `Length: ${size.length}, Height: ${size.height}, Weight: ${size.weight}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  commonName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 22,
    fontStyle: 'italic',
    color: colors.secondary,
    marginBottom: 25,
    textAlign: 'center',
  },
  keyValueContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
  },
  keyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    minWidth: 130,
  },
  valueText: {
    fontSize: 18,
    color: colors.muted,
    flex: 1,
    flexWrap: 'wrap',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: colors.muted,
    marginHorizontal: 20,
  },
  cardContainer: {
    borderRadius: 10,
  },
});

export default AnimalInfoScreen;
