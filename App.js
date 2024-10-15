import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerScreens } from './Drawer';
import Search from './Components/Search';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor="#1E1E1E" />
            <Stack.Navigator initialRouteName="Drawers">
                <Stack.Screen
                    name="Drawers"
                    component={DrawerScreens}
                    options={{ headerShown: false }}
                />
                <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
