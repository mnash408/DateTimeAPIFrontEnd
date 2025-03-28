/**
 * Date Time Service Mobile App
 */

import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Alert,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

// Interface for the date time response
interface DateTimeResponse {
  currentDateTime: string;
}

// Define API URL for the emulator to access your host machine
const API_BASE_URL = 'http://10.0.2.2:8080';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [dateTime, setDateTime] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const fetchCurrentDateTime = async () => {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/current-datetime`);
      const response = await fetch(`${API_BASE_URL}/current-datetime`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch datetime: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      return data;
    } catch (error) {
      console.error('Error in fetchCurrentDateTime:', error);
      throw error;
    }
  };

  const getDateTime = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Calling getDateTime');
      const response: DateTimeResponse = await fetchCurrentDateTime();
      console.log('Response received:', response);
      setDateTime(response.currentDateTime);
    } catch (err: any) {
      const errorMessage = 'Failed to fetch date time. Make sure the backend server is running.';
      setError(errorMessage);
      console.error('Error in getDateTime:', err);
      Alert.alert('Error', errorMessage + '\n\n' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <Text style={[styles.title, {color: isDarkMode ? Colors.white : Colors.black}]}>
            Date Time Service
          </Text>
          
          <View style={styles.card}>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : dateTime ? (
              <Text style={styles.dateTimeText}>Current Date & Time: {dateTime}</Text>
            ) : (
              <Text style={styles.placeholderText}>Press the button to get current date & time</Text>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={getDateTime}
              disabled={loading}>
              <Text style={styles.buttonText}>
                {loading ? 'Loading...' : 'Get Current Date & Time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;