import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

const useBackHandler = () =>  {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('等陣先!🧐', '真係要走?真係要走?咁好啦\n我只好求你繼續留係度😭', [
        {
          text: '我要繼續變強!One Punch💪',
          onPress: () => null,
          style: 'cancel',
        },
        { text: '你傻左咩我寧願睇貓片啦🐱', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
};

export default useBackHandler
