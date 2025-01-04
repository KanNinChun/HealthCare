import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

const useBackHandler = () =>  {
  useEffect(() => {
    const backAction = () => {
      Alert.alert('等陣先!🧐', '唸下你有無野漏左要記錄?', [
        {
          text: '哎呀漏左小小嘢添💭',
          onPress: () => null,
          style: 'cancel',
        },
        { text: '梗係無,放心啦✨', onPress: () => BackHandler.exitApp() },
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
