import React from 'react';
import { SafeAreaView } from 'react-native';
import { Provider } from 'react-redux';
import { Store } from './redux/store';
import AppProvider from './navigations/AppProvider';
import RootStackNavigation from './navigations/RootStackNavigation';

function App () {

    return (
      <Provider store={Store}>
        <AppProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
              <RootStackNavigation />
            </SafeAreaView>
        </AppProvider>  
      </Provider>
    );
  };

export default App;