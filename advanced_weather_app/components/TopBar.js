import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity, TextInput, View, FlatList, Text } from "react-native";
import { useTopBar } from '../context/TopBarContext';
import { useLocation } from '../context/LocationContext';
import { getUserLocation } from './Location';
import { useState } from 'react';
import { extractCity } from '../utils/weatherApi';
import { useResponsiveContext } from "../context/ResponsiveContext";

export default function TopBar() {
  const insets = useSafeAreaInsets();
  const { height, width, moderateScale, verticalScale, horizontalScale } = useResponsiveContext();
  const { searchText, setSearchText, geoClicked, setGeoClicked, lastUsed, setLastUsed } = useTopBar();
  const { location, setLocation, setErrorMsg , selectedLocation, setSelectedLocation} = useLocation();
  const [ suggestions, setSuggestions ] = useState([]);

  // Geo coding renvoie une liste pour 2 caracteres
  const searchCitiesByName = async (query) => {
    if (!query) return setSuggestions([]);
    try {
      const result = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en`);
      const data = await result.json();
      console.log("data === ", data);
      console.log("query === ", query);
      console.log("data.results === ", data.results);
      setSuggestions(data.results || []);
    } catch (error) {
      console.error(error);
      setSuggestions([]);
    }
  };

  // Probleme test web car l'API n'accepte pas le CORS 
  const searchCityByCoords = async (lat, lon) => {
    try {
      console.log('lat = ', lat);
      console.log('lon = ', lon);
      const result = await fetch(
        // `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`
        // `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=fr`
 
      );
      if (!result.ok) {
        throw new Error(`Erreur API: ${result.status} ${result.statusText}`);
      }
      console.log("HTTP status:", result.status);
      const data = await result.json();
      console.log("API response:", data);
      const city = extractCity(data.address);
      if (!city) {
        throw new Error("Aucune ville trouvée pour ces coordonnées ");
      }
      const newLocation = {
        // name: data.locality,
        name: city,
        // admin1: data.principalSubdivision, // Region
        admin1: data.address.state,
        // country: data.countryName,
        country: data.address.country,
        // countryCode: data.countryCode,
        countryCode: data.address.country_code,
        latitude: lat,
        longitude: lon,
      }
      setSelectedLocation(newLocation);
      return newLocation;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const styles = StyleSheet.create({
    containerTopBar: {
      height: width > height ? verticalScale(120) : verticalScale(80),
      flexDirection: 'row',
      backgroundColor: '#000000ff',
      alignItems: 'center',
      justifyContent: 'center',
      gap: moderateScale(10),
      padding: moderateScale(4), 
      position: 'relative'
    },
    input: {
      flex: 1,
      height: width > height ? '85%' : '70%',
      backgroundColor: '#d6f0f7ff',
      color: '#000000ff',
      padding: moderateScale(4),
      borderRadius: moderateScale(16),
      margin: moderateScale(4),
      fontSize: moderateScale(10),
    },
    geoButton: {

    },  
    suggestionsList: {
      position: 'absolute',
      left: 0,
      right: 0,
      zIndex: 1000,
      maxHeight: width > height ? verticalScale(250) : verticalScale(350),
      top: width > height ? verticalScale(120) + insets.top : verticalScale(80) + insets.top
    },
   suggestionItem: {
      padding: moderateScale(14),
      borderBottomWidth: 1,
      borderBottomColor: '#d6f0f7ff',
      backgroundColor: '#000000ff'
    },
  });

    return (
      <>
        <View style={styles.containerTopBar}>
            <TextInput
                placeholder="Search location"
                returnKeyType="search"
                value={searchText}
                onChangeText={(text) => {
                    setSearchText(text);
                    searchCitiesByName(text);
                }}
                onFocus={() => setLastUsed("input")}
                onSubmitEditing={() => {
                  console.log("User pressed Enter with:", searchText);
                  console.log("TEST User pressed Enter with:", suggestions[0]);
                  // Recuperer l'item de GeoCoding correspondant a SearchText : prendre le premier element avant de clear Suggestions ??
                  if (!suggestions || suggestions.length === 0) {
                    setErrorMsg("Could not find any results for the supplied address");
                  } else {
                    setErrorMsg(null);
                    setSelectedLocation(suggestions[0]);
                  }
                  setSuggestions([]);
                }}
                style={styles.input}
            />
            <TouchableOpacity onPress={() => {
              setSuggestions([]);
              setSelectedLocation(null);
              getUserLocation({ setLocation, setErrorMsg, setGeoClicked, setLastUsed });
              if (location) {
                const city = searchCityByCoords(location.coords.latitude, location.coords.longitude);
                if (!city) {
                  setErrorMsg("Could not find any results for the supplied coordinates");
                } else {
                  setErrorMsg(null);
                  // setSelectedLocation(suggestions[0]);
                }
                console.log("GeoLocation == :", location);
              }
            }} 
            >
                <FontAwesome name="location-arrow" size={moderateScale(24)} color="#d6f0f7ff" />
            </TouchableOpacity>
        </View>
        {suggestions.length > 0 && (
          <FlatList
          style={styles.suggestionsList}
          data={suggestions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={ () => {
                setSearchText(item.name);
                setSelectedLocation(item);
                setSuggestions([]);
                console.log("User pressed suggestion:", item.name);
                console.log("TEST User pressed suggestion:", item);
              }}
              style={styles.suggestionItem}
            >
              <Text style={{color:'#d6f0f7ff'}}><strong style={{color: '#17e4ffff'}}>{item.name}</strong>, {item.admin1}, {item.country}</Text>
            </TouchableOpacity>
          )}
          />
        )}
        </>
    );
}