import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from './firebaseConfig';
import { isLoading } from 'expo-font';
import Constants from 'expo-constants';
const Search = () => {
    const [cityname, setCityName] = useState('');
    const [citydata, setCityData] = useState([]);
    const [data, setData] = useState([]);
    const [id, setid] = useState('');
    const navigation = useNavigation();
    const [isLoading, setisloading] = useState(false);
    const apikey = Constants.expoConfig.extra.apiKey;

  
  

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "cityname"));
                const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(items);
                setid(items[0].id);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);

    const addCity = async (city, id) => {
        console.log("id is", id);
        navigation.navigate('Drawers', { isLoading: true });
        if (city.trim()) {
            try {
                await addDoc(collection(db, "cityname"), {
                    name: city.trim(),
                    timestamp: new Date()
                });
                await deleteCity(id);
                await fetchData();

            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }




    };


    const deleteCity = async (id) => {
        console.log("Attempting to delete city with ID:", id);
        try {
            await deleteDoc(doc(db, "cityname", id));
            await fetchData();
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    };

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "cityname"));
            const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setData(items);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await fetch(`http://api.weatherapi.com/v1/search.json?key=${apikey}&q=${cityname}`);
                const parseddata = await response.json();
                setCityData(parseddata);
            } catch (error) {
                console.log("Failed to fetch data");
            }
        };

        if (cityname) {
            fetchdata();
        }
    }, [cityname]);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.inputContainer}>
                <Pressable style={styles.pressable} onPress={() => navigation.navigate('Drawers')}>
                    <AntDesign name="back" size={24} color="white" />
                </Pressable>
                <TextInput
                    value={cityname}
                    onChangeText={setCityName}
                    placeholder='Search a Location'
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    style={styles.input}
                    textAlign='center'
                />
            </View>

            <ScrollView style={styles.listcontainer}>
                {citydata.length > 0 ? (
                    citydata.map((item) => (
                        <Pressable key={item.id} onPress={() => addCity(item.name, id)} style={styles.list}>
                            <Text style={styles.nametext}>{item.name}</Text>
                            <Text style={styles.countrytext}>{item.country}</Text>
                        </Pressable>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No results found</Text>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Search;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
        paddingTop: Platform.OS === 'android' ? 40 : 70,
        paddingHorizontal: '3%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#404040',
        borderRadius: 13,
        paddingHorizontal: 10,
        height: Platform.OS === 'android' ? 41 : 37,
        marginBottom: 10,
    },
    listcontainer: {
        flex: 1,
    },
    pressable: {
        padding: 5,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        marginRight: 35,
    },
    list: {
        marginTop: 4,
        backgroundColor: '#2C2C2C',
        borderRadius: 12,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
    },
    nametext: {
        fontSize: 22,
        color: 'white',
        fontWeight: '600',
    },
    countrytext: {
        fontSize: 18,
        color: 'white',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: 'white',
        fontSize: 18,
    },
});
