// App.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './AuthScreen'; // Import your authentication screen
import QuestionScreen from './QuestionScreen'; // Import your screen for answering questions
import CompletedTestScreen from './CompletedTestScreen'; // Import your screen for viewing completed test

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Screen for user authentication */}
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Login/Signup' }} />

        {/* Screen for selecting and answering questions */}
        <Stack.Screen name="Questions" component={QuestionScreen} options={{ title: 'Answer Questions' }} />

        {/* Screen for viewing completed test */}
        <Stack.Screen name="CompletedTest" component={CompletedTestScreen} options={{ title: 'Completed Test' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
