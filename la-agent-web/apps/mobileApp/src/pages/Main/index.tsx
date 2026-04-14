import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { routerList } from '@/routers';
import { getItem } from '@/utils';
import { navigationRef } from '@/utils/navigationHelper';

const Stack = createNativeStackNavigator();

const Main: React.FC = () => {
  const token = getItem('BMOS-ACCESS-TOKEN');
  const initPath: string = token ? 'Chat' : 'Login';
  return (
    <NavigationContainer ref={navigationRef}>
      {/* @ts-ignore */}
      <Stack.Navigator initialRouteName={initPath} screenOptions={{ headerShown: false }}>
        {/* @ts-ignore */}
        {
          routerList && routerList.map((item) => {
            return (
              <Stack.Screen name={item.name} component={item.component} key={item.name} />
            )
          })
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Main;