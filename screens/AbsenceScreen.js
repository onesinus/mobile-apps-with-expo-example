import React, { useState, useEffect } from 'react';
import { Image, Alert, AsyncStorage } from 'react-native';
import { 
  Container, Content, Button, Text, Grid, Col,
  Card, CardItem, Thumbnail, Left, Body, Toast, Root, Spinner
} from 'native-base';

import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import { Camera } from "../components";

import { formatDate, customFetch } from "../helpers";
import { screenHeight, screenWidth } from "../helpers/deviceInfo";

const { getData } = require("../helpers/asyncStorage");

const { BACKEND_URL } = require("../config/global_variables");

export default function AbsenceScreen({
  navigation,
  route
}) {
  const [isLoading, setIsLoading] = useState(false);
  const AttendanceOut = route.params ? route.params.AttendanceOut : undefined;
  const [user, setUser] = useState(null);

  const [location, setLocation] = useState(null);
  const [locationDetail, setLocationDetail] = useState(null);
  const [imgFace, setImgFace] = useState(null);
  const [time, setTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    getLocation();
    setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);


    (async () => {
      let strUser = await getData('user');
      let user = JSON.parse(strUser);
      setUser(user);
    })();

    return () => {
      setUser(null);
      setLocation(null);
      setLocationDetail(null);
      setImgFace(null);
      setTime(null);
    }
  }, []);

  useEffect(() => {
    if (location) {
      getDetailLocation({longitude: location.coords.longitude, latitude: location.coords.latitude});
    }
  }, [location]);

  const getLocation = async () => {
    setLocationDetail(null);
    setIsLoading(false);
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        text: 'Permission to access location was denied',
        buttonText: 'OK',
        duration: 5000
      });        
    }else {
      let tempLocation  = await Location.getCurrentPositionAsync({});
      setLocation(tempLocation);     
    }
  }

  const getDetailLocation = async(longlat) => {
    const detailLocation = await Location.reverseGeocodeAsync(longlat);
    setLocationDetail(detailLocation);
  }

  const onSubmit = async () => {
    if (!location || !locationDetail) {
      Toast.show({
        text: 'Your location is not defined, Please click re-take location to find your current location',
        buttonText: 'OK',
        duration: 5000
      });
    }else{
      const type_title = AttendanceOut ? 'Check Out' : 'Check In';
      Alert.alert(
        `Confirm ${type_title}`,
        'Are you sure your attendance data is correct?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: async() => {
            /* Jika support fingerprint, tampilkan ,jika tidak biarkan dulu */
            const supportedMethods = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (supportedMethods.length === 0) {
              processAbsence();        
            }else{
              const isEnrolled = await LocalAuthentication.authenticateAsync({
                // promptMessage: 'Put your finger to verify'
              });
              
              if (isEnrolled.success) {
                processAbsence();        
              }
            }
            /* End face / finger print code */
          }},
        ]
      );
    }
  }

  const uploadImgFace = async (localUri) => {
    let filename = localUri.split('/').pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append('img_face', { uri: localUri, name: filename, type });

    const token = await AsyncStorage.getItem("token");

    try {
      const uploaded_response = await fetch(`${BACKEND_URL}/attendance/upload_face`, {
        method: 'POST',
        headers: { token },
        body: formData
      });

      const uploaded_url = await uploaded_response.json();
      return `${uploaded_url}`;
    } catch (err) {
      setImgFace("IMG Not Found")
      console.warn(JSON.stringify(err));        
    }
  }

  const processAbsence = async () => {
    setIsLoading(true);

    let urlFace = await uploadImgFace(imgFace);

    // This is for handle testing upload image
    // Remove if production already
    if (!urlFace.includes("google")) {
      urlFace = `${BACKEND_URL}/${urlFace}`;
    }
    // End testing upload image
    
    let sendData = { location, locationDetail, time, imgFace: urlFace};
    let resPostAttendance;

    if (AttendanceOut){ sendData.type = 'out' };

    resPostAttendance = await customFetch('internal', 'POST', 'attendance', sendData);
    
    if (AttendanceOut && resPostAttendance.id) {
      resPostAttendance = await customFetch('internal', 'PUT', `attendance/${AttendanceOut}`, {AttendanceOut: resPostAttendance.id});
    }
    
    if (!resPostAttendance.success) {
      console.log(resPostAttendance);
        Toast.show({
            text: resPostAttendance["err_msg"],
            buttonText: 'OK',
            duration: 5000
        });
    }else{ // Success do Attendance
      navigation.reset({
        index: 0,
        routes: [
          { name: "Home" }
        ]
      });
    }
  }

  const retakePicture = () => {
    setIsLoading(false);
    setImgFace(null);
  }

  if (!imgFace) {
    return <Camera setImgFace={setImgFace} />
  }else {
    return (
      <Root>
          <Container>
            <Content>
              <Card>
                <CardItem>
                  <Left>
                    <Thumbnail source={require('../assets/blank_avatar.png')} />
                    <Body>
                      <Text>{user ? user.name : 'User'}</Text>
                      <Text note>{formatDate(time)}</Text>
                      {
                        !locationDetail && <><Text note>Getting Location...</Text></>
                      }
                      {
                        locationDetail && <Text note>{locationDetail[0].street}</Text>
                      }
                    </Body>
                  </Left>
                </CardItem>
                <CardItem>
                    <Body>
                      <Image 
                        source={{uri: imgFace}} 
                        style={{
                          height: screenHeight/2, 
                          width: screenWidth - (screenWidth/12), 
                          flex: 1
                        }}
                      />
                    </Body>
                  </CardItem>
              </Card>
              <Grid>
                <Col>
                  <Button 
                    full 
                    success
                    onPress={() => getLocation()}
                  >
                    <Text> Re-Take Location</Text>
                  </Button>
                </Col>
                <Col>
                  <Button 
                    full 
                    info
                    onPress={() => retakePicture()}
                    >
                      <Text> Re-Take Picture</Text>
                  </Button>
                </Col>
              </Grid>
              <Button 
                full 
                primary
                onPress={onSubmit}
                disabled={isLoading}
              >
                {
                  !AttendanceOut && !isLoading &&
                  <Text> Check In </Text>
                }
                {
                  AttendanceOut && !isLoading &&
                  <Text> Check Out </Text>
                }
                {
                  isLoading && <Spinner color="blue" />
                }
              </Button>
            </Content>
        </Container>
      </Root>
    );
  }
}