import React,{ useState , useEffect}  from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View ,} from 'react-native';
import { hospitals, clinics, clinics2 } from '../../constants/hospitals';

export default function Map() {
  const [isFocused, setIsFocused] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {     // 顯示地標
    if (isFocused) {
      setMapReady(false);
      setTimeout(() => setMapReady(true), 100);
    }
    setIsFocused(true);
  }, [isFocused]);

  if (!isFocused || !mapReady) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{          // 將地圖一開始設定為香港
          latitude: 22.3193,
          longitude: 114.1694,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: hospital.latitude,
              longitude: hospital.longitude
            }}
            title={hospital.institution_tc}
            description={hospital.address_tc }
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
