import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet, Pressable, Text } from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Karachi from './Components/Karachi';
import City2 from "./Components/City2";
import City3 from "./Components/City3";
import City4 from "./Components/City4";
import City5 from "./Components/City5";
import Search from './Components/Search';
import { Entypo } from '@expo/vector-icons';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from './Components/firebaseConfig';

const Drawer = createDrawerNavigator();

export const DrawerScreens = ({ navigation, route }) => {
  const isl = route.params;
  const [cityNames, setCityNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const collectionRef = collection(db, 'cityname');

    const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (items.length > 0) {
        items.sort((a, b) => b.timestamp.toMillis() - a.timestamp.toMillis());
        setCityNames(items.map(item => item.name));
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, (error) => {
      console.error("Error fetching city names: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (cityNames.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red' }}>No cities available.</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate('Search')}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
              paddingRight: 20,
              paddingVertical: 5,
              flexDirection: 'row',
              alignItems: 'center',
            })}
          >
            <Text style={{ color: "#fff", fontSize: 16 }}>Search</Text>
            <Entypo name="magnifying-glass" size={20} color="#fff" style={{ marginLeft: 5 }} />
          </Pressable>
        ),
        headerStyle: {
          backgroundColor: '#1E1E1E',
        },
        drawerLabelStyle: {
          fontSize: 18,
        },
        headerTintColor: '#fff',
        drawerStyle: {
          backgroundColor: '#1E1E1E',
        },
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#8e8e8e',
        drawerActiveBackgroundColor: 'transparent',
        drawerInactiveBackgroundColor: 'transparent',
      }}
    >
      {cityNames[0] && <Drawer.Screen name={cityNames[0]} component={Karachi} initialParams={{ isl }} />}
      {cityNames[1] && <Drawer.Screen name={cityNames[1]} component={City2} />}
      {cityNames[2] && <Drawer.Screen name={cityNames[2]} component={City3} />}
      {cityNames[3] && <Drawer.Screen name={cityNames[3]} component={City4} />}
      {cityNames[4] && <Drawer.Screen name={cityNames[4]} component={City5} />}
    </Drawer.Navigator>
  );
};

export default DrawerScreens;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
});
