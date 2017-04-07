/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    StatusBar
    } from 'react-native';
//var Animated = require('Animated');
const {width,height,scale} = require('Dimensions').get('window');
import DataRepository from '../api/DataRepository.js';
const dataRepository = new DataRepository();

export default class SplashView extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            cover:null,
            bounceValue:new Animated.Value(1),
        };
      }


    render() {
        let image,text = 'GitHub Haohao';
        if(this.state.cover) {
            console.log(this.state.cover);
            image = {uri:this.state.cover.img};
        } else {
            image = require('image!splash');
        }
        return (
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#00a2ed"
                    barStyle="light-content"
                    />
               <Animated.Image
                   source={image}
                   style={{
                       flex:1,
                       width:width,
                       height:1,
                       transform:[
                           {scale:this.state.bounceValue},
                       ]
                   }}
                   />
                <Text style={styles.title}>{text}</Text>
                <Image source={{uri:'splash_logo'}} style={styles.logo}/>
            </View>
        );
    }

    componentDidMount() {
        this.fetchData();
        this.state.bounceValue.setValue(1);
        Animated.timing(
            this.state.bounceValue,
            {
                toValue:1.8,
                duration:3000,
            }
        ).start();
    }

    fetchData(){
        dataRepository.updateCover();
        dataRepository.getCover()
            .then((data) => {
                if(data){
                    this.setState({
                        cover:data,
                    })
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .done();

    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    logo: {
        resizeMode: 'contain',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 30,
        height: 54,
        backgroundColor: 'transparent',
    },
    title: {
        flex: 1,
        fontSize: 16,
        textAlign: 'center',
        color: 'white',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 10,
        backgroundColor: 'transparent',
    }

});

