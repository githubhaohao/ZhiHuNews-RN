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
  Navigator,
    BackAndroid,
    ToastAndroid,
} from 'react-native';
import SplashView from './component/SplashView.js';
import MainView from './component/MainView.js';
import StoryDetailView from './component/StoryDetailView.js';
import FavoriteStoryView from './component/FavoriteStoryView.js';

var navigator,lastBackPress;

export default class ZhiHuNews extends Component {
  // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
        isShowSplash:true,
      };
    }

  render() {
    if(!this.state.isShowSplash) {
      let initialRoute = {name:'home'};
      return (
          <Navigator
              style={styles.container}
              initialRoute={initialRoute}
              configureScene={() => Navigator.SceneConfigs.FadeAndroid}
              renderScene={(route, navigationOperations, onComponentRef) => this.routeMapper(route, navigationOperations, onComponentRef)}
              />
      )
    } else {
      return (
          <SplashView/>
      );
    }
  }

    componentWillMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.backListener.bind(this));
    }

    backListener(){
        if (navigator && navigator.getCurrentRoutes().length > 1) {
            navigator.pop();
            return true;
        } else if (lastBackPress && lastBackPress + 2000 > Date.now()) {
            return false;
        } else {
            lastBackPress = Date.now();
            ToastAndroid.show('在按一次退出知乎新闻',ToastAndroid.SHORT);
            return true;

        }

        return false;
    }

    componentWillUnMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.backListener.bind(this));
    }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isShowSplash:false,
      })
    },3000);
  }

  routeMapper(route, navigationOperations, onComponentRef){
    navigator = navigationOperations;
    if(route.name == 'home'){
      return (
          <MainView navigator={navigationOperations}/>
      )
    } else if (route.name == 'story') {
      return (
          <View style={styles.container}>
            <StoryDetailView
                navigator={navigationOperations}
                story={route.story} />
          </View>
      )
    } else if (route.name == 'favorite') {
        return (
            <FavoriteStoryView navigator={navigationOperations}/>
        )
    }

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ZhiHuNews', () => ZhiHuNews);
