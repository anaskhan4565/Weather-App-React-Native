import { React, useState, useEffect } from "react";
import { View, Text, Button, ActivityIndicator, StyleSheet, Image, ImageBackground, Platform, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { firestore } from './firebaseConfig';
import { db } from './firebaseConfig';
import { useRoute } from "@react-navigation/native";
import Constants from 'expo-constants';
export default function City4() {
    const route = useRoute();
    const isl = route.params;
    const apikey = Constants.expoConfig.extra.apiKey;
  

    const [city, setcity] = useState('')
    const [wheatherdata, setwheather] = useState();
    const [isloading, setisloading] = useState(true);
    const [isloading2, setisloading2] = useState(false);
    const [forecast, setforecast] = useState();
    const [days, setdays] = useState(3);
    const [data, setData] = useState([]);

    useEffect(() => {
        setisloading2(isl);
        const collectionRef = collection(db, 'cityname');

        const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("Data received: ", items); // Debugging line to check data

            setData(items);
            if (items.length > 0) {
                items.sort((a, b) => {
                    const timestampA = a.timestamp.toMillis(); // Convert to milliseconds if necessary
                    const timestampB = b.timestamp.toMillis(); // Convert to milliseconds if necessary
                    return timestampB - timestampA; // For descending order
                });
                setcity(items[3].name);
            }
            setisloading2(false);
        }, (error) => {
            console.error("Error fetching city names: ", error);
        });

        return () => {
            console.log("Unsubscribing from Firestore"); // Debugging line to confirm cleanup
            unsubscribe();
        };

    }, [isl]);
    useEffect(() => {
        if (!city) return;

        const fetchWeatherData = async () => {
            try {
                const currentdata = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`);
                const parsedcurrentdata = await currentdata.json();
                setwheather(parsedcurrentdata);

                const forecastdata = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=${days}`);
                const parsedforecastdata = await forecastdata.json();
                setforecast(parsedforecastdata);
            } catch (error) {
                console.error("Error fetching weather data: ", error);
            } finally {
                setisloading(false);
            }
        };

        fetchWeatherData();
    }, [city]);

    console.log(data);

    function getDayName(dateString) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateString);
        return daysOfWeek[date.getDay()];
    }
    function gettime(dateString) {
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date(dateString);
        let time = dateString.substring(11, 16)
        return daysOfWeek[date.getDay()] + ' ' + time;
    }




    if (isloading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="blue" />
            </View>

        )
    }
    if (isloading2) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="green" />
            </View>

        )
    }

    const textcolor = wheatherdata.current.is_day === 0 ? 'white' : 'black';
    const PrintForecast = () => {
        const arrayforecast = [];
        for (let index = 1; index < days; index++) {
            arrayforecast.push(
                <View style={styles.forecastsubContainer}>
                    <Text style={[styles.dayText, { color: textcolor }]}> {getDayName(forecast.forecast.forecastday[index].date)}</Text>
                    <Image source={{ uri: 'http:' + forecast.forecast.forecastday[index].day.condition.icon }} style={styles.forecastimage} />
                    <View style={styles.subtempratureContainer}>
                        <Text style={[styles.maxtempText, { color: textcolor }]}>  {forecast.forecast.forecastday[index].day.maxtemp_c}°</Text>
                        <Text>  /</Text>
                        <Text style={[styles.mintempText, { color: textcolor }]}>  {forecast.forecast.forecastday[index].day.mintemp_c}°</Text>
                    </View>


                </View>)

        }
        return arrayforecast;



    }



    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                source={wheatherdata.current.is_day === 1
                    ? require('/Users/anaskhan/Desktop/Mobileapps/Tryingthings/assets/backgroundImage/vintage-high-blue-abstract-old.jpg')
                    : require('/Users/anaskhan/Desktop/Mobileapps/Tryingthings/assets/backgroundImage/beautiful-night-sky-with-shiny-stars.jpg')}
                style={styles.imageBackground}
            />

            <View style={styles.container}>

                <View style={styles.currentContainer}>

                    {/* <View style={styles.nameContainer}>
                        <Text style={styles.nameText}>  {wheatherdata.location.name}</Text>
                    </View> */}
                    <View style={styles.conditionContainer}>
                        <Text style={[styles.conditionText, { color: textcolor }]}>
                            {forecast.forecast.forecastday[0].day.condition.text}
                        </Text>

                    </View>
                    <View style={styles.imageContainer}>

                        <Text style={[styles.tempratureText, { color: textcolor }]}> {wheatherdata.current.temp_c}°C</Text>
                        <Image style={styles.currentImage} source={{ uri: 'http:' + wheatherdata.current.condition.icon }} />


                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={[styles.timeText, { color: textcolor }]}> {gettime(wheatherdata.location.localtime)}</Text>
                    </View>
                    <View style={styles.minmaxtopContainer}>
                        <Text style={[styles.maxtemptopText, { color: textcolor }]}>  {forecast.forecast.forecastday[0].day.maxtemp_c}°</Text>
                        <Text style={[styles.brakcettempText, { color: textcolor }]}>  /</Text>
                        <Text style={[styles.mintemptopText, { color: textcolor }]}>  {forecast.forecast.forecastday[0].day.mintemp_c}°</Text>
                    </View>
                    <View style={styles.feelslikeContainer}>
                        <Text style={[styles.feelslikeText, { color: textcolor }]}>Feels Like {wheatherdata.current.feelslike_c}°C</Text>
                    </View>
                    <View style={styles.lastupdatedContainer}>
                        <Text style={[styles.lastupdatedText, { color: textcolor }]}>Last Updated {wheatherdata.current.last_updated}</Text>
                    </View>
                </View>
                <ScrollView style={styles.horizontalscrollview} horizontal={true}>
                    <View style={styles.forecastContainer}>
                        {PrintForecast()}
                    </View>
                </ScrollView>

                <View style={styles.extraContainer}>
                    <View style={styles.humidityContainer}>
                        <Ionicons name="water" size={40} color="dodgerblue" />
                        <Text style={[styles.humidityText, { color: textcolor }]}>Humidity: </Text>
                        <Text style={[styles.humiditydataText, { color: textcolor }]}>{wheatherdata.current.humidity} %</Text>


                    </View>
                    <View style={styles.heatindexContainer}>
                        <MaterialIcons name="sunny" size={40} color="gold" />
                        <Text style={[styles.heatindextext, { color: textcolor }]}>Heat Index </Text>
                        <Text style={[styles.heatindexdatatext, { color: textcolor }]}>{wheatherdata.current.heatindex_c}°</Text>

                    </View>
                    <View style={styles.uvindexContainer}>
                        <MaterialCommunityIcons name="sun-thermometer" size={40} color="orange" />
                        <Text style={[styles.uvindextext, { color: textcolor }]}>Uv Index </Text>
                        <Text style={[styles.uvindexdatatext, { color: textcolor }]}>{wheatherdata.current.uv > 6 ? 'High' : 'Low'}</Text>

                    </View>
                    <View style={styles.precipitationContainer}>
                        <FontAwesome6 name="cloud-rain" size={40} color="lightskyblue" />
                        <Text style={[styles.precipitationtext, { color: textcolor }]}> precipatation</Text>
                        <Text style={[styles.precipitationdatatext, { color: textcolor }]}> {wheatherdata.current.precip_mm} mm</Text>

                    </View>
                    <View style={styles.windspeedContainer}>
                        <Feather name="wind" size={40} color="darkgrey" />
                        <Text style={[styles.windspeedtext, { color: textcolor }]}> Wind Speed</Text>
                        <Text style={[styles.windspeeddatatext, { color: textcolor }]}>{wheatherdata.current.wind_kph} Km/h</Text>

                    </View>



                </View>






                <Image source={wheatherdata.current.icon} />
            </View>
        </ScrollView >

    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
    },
    currentContainer: {
        marginRight: 2,
        marginLeft: 2,
        marginBottom: 100,


    },
    forecastContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    extraContainer: {
        marginTop: 20,
        marginLeft: 10,
        flexDirection: 'column',

    },
    forecastsubContainer: {
        flexDirection: 'column',

    },
    horizontalscrollview: {
        marginBottom: 20,
    },
    imageBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    // nameContainer: {
    //     alignItems: 'center',
    //     paddingTop: 5,
    //     marginTop: 15,
    // },
    conditionContainer: {
        alignItems: 'center',
        justifyContent: 'center',

    },
    imageContainer: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    subtempratureContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',

    },
    conditionText: {
        marginTop: 40,
        fontSize: 28,
        marginBottom: 20,

        fontWeight: Platform.OS === 'android' ? '700' : '500',
    },
    timeContainer: {

    },
    feelslikeContainer: {
        marginLeft: Platform.OS === 'android' ? '65%' : '63%',
    },
    minmaxtopContainer: {
        flexDirection: 'row',
        marginLeft: Platform.OS === 'android' ? '67%' : '66%',
    },
    minmaxContainer: {
        flexDirection: 'row',
        marginLeft: Platform.OS === 'android' ? '71%' : '68%',
    },
    lastupdatedContainer: {
        paddingTop: 50,
    },
    humidityContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 10,
        marginLeft: 3,

    },
    heatindexContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 10,
        marginLeft: 3,
    },
    uvindexContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 10,
        marginLeft: 3,
    },
    windspeedContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 10,
    },
    precipitationContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        paddingTop: 10,
    },

    forecastimage: {
        marginLeft: 12,
        width: 90,
        height: 90,
        resizeMode: 'contain',
    },
    currentImage: {
        height: 120,
        width: 120,
        resizeMode: 'contain',
    },
    // nameText: {
    //     fontSize: 20,
    //     color: 'white',
    // },
    tempratureText: {
        fontSize: 65,
        fontWeight: Platform.OS === 'android' ? '500' : '500',

    },
    feelslikeText: {
        fontSize: 16,
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },
    timeText: {
        fontSize: 30,
        fontWeight: Platform.OS === 'android' ? '600' : '500',
        marginLeft: Platform.OS === 'android' ? '3%' : '3%',

    },
    lastupdatedText: {
        fontWeight: Platform.OS === 'android' ? '600' : '500',
        marginLeft: Platform.OS === 'android' ? '3%' : '3%',

        fontSize: 15,
    },
    dayText: {
        fontSize: 23,
        marginLeft: 18,
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },
    maxtemptopText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 1,

    },
    mintemptopText: {
        fontSize: 18,

    },
    brakcettempText: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginLeft: 10,

    },

    maxtempText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 5,

    },

    mintempText: {
        fontSize: 18,
        marginRight: 15,

    },
    humidityText: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: 6,
        fontWeight: Platform.OS === 'android' ? '400' : '400',

    },
    heatindextext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: 6,
        fontWeight: Platform.OS === 'android' ? '400' : '400',

    },
    uvindextext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: 6,
        fontWeight: Platform.OS === 'android' ? '400' : '400',

    },
    windspeedtext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: 6,
        fontWeight: Platform.OS === 'android' ? '400' : '400',

    },
    precipitationtext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: 6,
        fontWeight: Platform.OS === 'android' ? '400' : '400',

    },
    humiditydataText: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: Platform.OS === 'android' ? '35%' : '31%',
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },
    heatindexdatatext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: Platform.OS === 'android' ? '32%' : '28%',
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },
    uvindexdatatext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: Platform.OS === 'android' ? '38%' : '34%',
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },
    windspeeddatatext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: Platform.OS === 'android' ? '29%' : '24%',
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },
    precipitationdatatext: {
        marginTop: 10,
        fontSize: 22,
        marginLeft: Platform.OS === 'android' ? '25%' : '21%',
        fontWeight: Platform.OS === 'android' ? '600' : '500',

    },



})