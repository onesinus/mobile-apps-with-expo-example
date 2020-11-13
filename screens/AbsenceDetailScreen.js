import React from "react";
import { Image } from "react-native";
import {  Container, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';

import { formatDate } from '../helpers';

export default function AbsenceDetailScreen({
    route
}) {
    const {dataDetail} = route.params;

    const { 
        locationDetail, timezone, utc_offset, abbreviation,
        client_ip, time, imgUrl, blankPicture
    } = dataDetail;

    return (
        <Container>
            <Content>
                <Image style={{ height: 300, flex: 1 }} source={ imgUrl ? { uri: imgUrl } : blankPicture } />
                <ListItem itemDivider>
                    <Text>Location</Text>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="md-locate" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>{locationDetail[0].street}</Text>
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="ios-bicycle" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>{locationDetail[0].city}</Text>
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="ios-car" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>{locationDetail[0].region}</Text>
                    </Body>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="ios-at" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>{locationDetail[0].postalCode}</Text>
                    </Body>
                </ListItem>

                <ListItem itemDivider>
                    <Text>Date</Text>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="ios-time" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>{`${formatDate(time, 'date')}`}</Text>
                    </Body>
                </ListItem>
                <ListItem itemDivider>
                    <Text>Time</Text>
                </ListItem>
                <ListItem icon>
                    <Left>
                        <Button style={{ backgroundColor: "#007AFF" }}>
                            <Icon active name="ios-time" />
                        </Button>
                    </Left>
                    <Body>
                        <Text>{`${formatDate(time, 'time')}`}</Text>
                    </Body>
                </ListItem>

            </Content>
      </Container>
    );
}