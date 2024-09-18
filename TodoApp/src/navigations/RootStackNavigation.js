import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from "../screens/Home";

const Stack = createStackNavigator();

const RootStackNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}
            >
                <Stack.Group screenOptions = {{ ...TransitionPresets.SlideFromRightIOS}}>
                    <Stack.Screen
                        name = "MainScreen"
                        component = {Home}
                    />
                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootStackNavigation;