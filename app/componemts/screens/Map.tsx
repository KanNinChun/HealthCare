import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { hospitals, clinics, clinics2 } from '../../constants/hospitals';
import { StyleSheet, View, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

export default function Map() {
  const [mapReady, setMapReady] = useState(false);
  const isFocused = useIsFocused();

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      if (isFocused) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    }
    getCurrentLocation();
  }, [isFocused]);

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // Combine all data sources
  const allFacilities = [
    ...hospitals.map(h => ({ ...h, type: 'hospital' })),
    ...clinics.map(c => ({ ...c, type: 'clinic' })),
    ...clinics2.map(c => ({ ...c, type: 'clinic2' }))
  ];

  useEffect(() => {
    if (isFocused) {
      setMapReady(false);
      setTimeout(() => setMapReady(true), 100);
    }
  }, [isFocused]);

  if (!isFocused || !mapReady) {
    return <View style={styles.container} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 22.3193,
            longitude: 114.1694,
            latitudeDelta: 1.5,
            longitudeDelta: 1.5,
          }}
          mapType="standard"
          showsUserLocation={true}
          showsMyLocationButton={true}
        >

          {hospitals.map((hospital, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: hospital.latitude,
                longitude: hospital.longitude
              }}
              title={hospital.institution_tc}
              description={hospital.address_tc}
              pinColor={hospital.with_AE_service_eng === '是' ? '#2ecc71' : '#e74c3c'} // 有英文服務提供 綠色 無就紅色
            />
          ))}
          {clinics.map((clinic, index) => (  //專科
            <Marker
              key={index}
              coordinate={{
                latitude: clinic.latitude,
                longitude: clinic.longitude
              }}
              title={clinic.institution_tc}
              description={clinic.address_tc}
              pinColor='#8f8fff'
            />
          ))}
          {clinics2.map((clinics2, index) => ( //普通科
            <Marker
              key={index}
              coordinate={{
                latitude: clinics2.latitude,
                longitude: clinics2.longitude
              }}
              title={clinics2.institution_tc}
              description={clinics2.address_tc}
              pinColor='#8f8fff'
            />
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  )
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