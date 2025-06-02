import AuthStack from './AuthStack';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './Utils';
const AppStack: any = createStackNavigator();
const ApplicationNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthStack />
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
