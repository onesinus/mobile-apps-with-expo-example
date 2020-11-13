import React, { useState } from "react"
import { 
  Drawer, Button,
  Left, Right,
  Container, Header, Title, Content, Footer, FooterTab, Body, Text, Icon
} from "native-base";

import { Image } from "react-native";
import { screenHeight, screenWidth } from "../helpers/deviceInfo";

export default function DrawerComponent(props) {
    const [drawer, setDrawer] = useState();

    const closeDrawer = () => {
        drawer._root.close();    
    }

    const openDrawer = () => {
        drawer._root.open();
    }

    return (
        <Drawer
            ref={(ref)  => setDrawer(ref)}
            content={
              <SideBar
                setToken={props.setToken}
                navigation={props.navigation}
              />
            }
            onClose={closeDrawer}
        >
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={openDrawer}>
                  <Icon name='menu' />
                </Button>
              </Left>
              <Body>
                <Title>{props.title}</Title>
              </Body>
              <Right />
            </Header>
            <Content>
              {props.children}
            </Content>
          </Container>
        </Drawer>
    );
}

function SideBar({
  navigation,
  setToken
}) {
  return (
    <Container>
      <Header> 
        <Body>
          <Image 
            style={{ 
              width: screenWidth-(screenWidth*1/5), 
              marginLeft: -10, 
              height: screenHeight/3
            }} 
            source={require('../assets/drawer_logo.jpg')} 
          />
        </Body>
      </Header>
      <Content 
        padder
        style={{
          marginTop: screenHeight/8
        }}
      >
        <Button transparent onPress={() => {
            navigation.reset({
              index: 0,
              routes: [
                { name: "Home" }
              ]
            });
        }}>
          <Icon name='home' />
          <Text>Home</Text>
        </Button>

        <Button transparent onPress={() => navigation.navigate("Absence")}>
          <Icon name='briefcase' />
          <Text>Add Attendance</Text>
        </Button>

        <Button transparent onPress={() => navigation.navigate("Setting")}>
          <Icon name='cog' />
          <Text>Settings</Text>
        </Button>


        <Button transparent onPress={() => setToken(null)}>
          <Icon name='log-out' />
          <Text>Logout</Text>          
        </Button>
      </Content>
      <Footer>
        <FooterTab>
          <Button full>
            <Text>Online Attendance | 0.0.1 | 2020</Text>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}