import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, ScrollView } from 'react-native';

import { hospitals, clinics } from '../../constants/hospitals';

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 22.3193,
          longitude: 114.1694,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            coordinate={hospital.coordinate}
            title={hospital.name}
            description={hospital.services.join(', ')}
            pinColor={hospital.type === '公立' ? '#2ecc71' : '#e74c3c'}
          />
        ))}
            {clinics.map((clinics, index) => (
          <Marker
            key={index}
            coordinate={clinics.coordinate}
            title={clinics.name}
            description={clinics.type}
            pinColor='#8f8fff'
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
