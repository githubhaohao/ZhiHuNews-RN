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
    WebView,
    ToolbarAndroid,
    StatusBar,
    ScrollView,
    Dimensions,
    ToastAndroid,
    } from 'react-native';

import DataRepository from '../api/DataRepository.js';
var BASE_URL = 'http://news.at.zhihu.com/api/4/news/';
const dataRepository = new DataRepository();
const HEADER_SIZE = 300;
var toolbarActions = [
    {title: '提醒', icon: require('image!ic_message_white'), show: 'always'},
    {title: '夜间模式', show: 'never'},
    {title: '设置选项', show: 'never'},
    {title: '用户反馈', show: 'never'},
    {title: '关于项目', show: 'never'},
];

const {width,height,scale} = Dimensions.get('window');

export default class StoryDetailView extends Component {

    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            story:this.props.story,
            detail:null,
            isLoading:true,
            isFavorite:false,
        };
      }

    render() {

        if(this.state.isFavorite) {
            toolbarActions[0] = {title: '收藏', icon: require('image!star_red'), show: 'always'};
        } else {
            toolbarActions[0] = {title: '收藏', icon: require('image!star_white'), show: 'always'};
        }

        if(this.state.isLoading){
            return (
                <View style={[styles.container,{alignItems:'center',justifyContent:'center'}]}>
                    <Text>正在加载...</Text>
                </View>
            )
        } else if (this.state.detail){

            let html = '<!DOCTYPE html><html><head><link rel="stylesheet" type="text/css" href="'
                + this.state.detail.css[0]
                + '" /></head><body>' + this.state.detail.body
                + '</body></html>';
            html = this.dealWithHtml(html);
            console.log(this.state.detail);

            return (
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor="#00a2ed"
                        barStyle="light-content"
                        />
                    <ToolbarAndroid
                        navIcon={require('image!ic_back_white')}
                        title={this.state.story.title}
                        titleColor="white"
                        style={styles.toolbar}
                        actions={toolbarActions}
                        onIconClicked={() => {this.props.navigator.pop()}}
                        onActionSelected={(position) => this.onActionSelected(position)}
                        />
                    <WebView
                        style={styles.container}
                        source={{html:html}}
                        startInLoadingState={true}
                        domStorageEnabled={true}
                        javaScriptEnabled={true}
                        />
                </View>
            );
        } else {
            return (
                <View style={[styles.container,{alignItems:'center',justifyContent:'center'}]}>
                    <Text>加载出错</Text>
                </View>
            )
        }

    }

    dealWithHtml(html : string){
        let key = '<div class="img-place-holder"></div>',newHtml;
        if(html.search(key) != -1 && this.state.story.images && this.state.story.images[0]){
            newHtml = html.replace(key,`<div class="img-place-holder" style="height: 200px"><a href=${this.state.detail.share_url}><img class="img-place-holder" src=${this.state.story.images[0]} style="width:100%;"/></a></div><div style="color:white;font-size: 22px;font-weight: bold;text-align: center;margin-top: -50px;margin-bottom: 10px;">${this.state.story.title }</div>`)
        } else{
            newHtml = html.replace(key,'');
        }

        return newHtml;
    }

    componentDidMount() {
        this.fetchStoryDetail();
        dataRepository.getItemFromStorage(this.state.story.id+'')
          .then((data) => {
                if(data) {
                    this.setState({
                        isFavorite:true,
                    })
                }
            })
    }

    fetchStoryDetail(){
        let url = BASE_URL + this.props.story.id;
        dataRepository.safeFetch(url)
            .then((data) => {
                this.setState({
                    detail:data,
                    isLoading:false,
                })
            })
    }

    onActionSelected(position){
        //alert(`position:${position}`);
        if (position == 0) {
            if (this.state.isFavorite) {
                dataRepository.removeItemFromStorage(this.state.story.id+'')
                  .then((error) => {
                        if(!error){
                            ToastAndroid.show('取消收藏',ToastAndroid.SHORT);
                            this.setState({
                                isFavorite:false,
                            })
                        }
                    })
            } else {
                dataRepository.saveItemToStorage(this.state.story.id+'',this.state.story)
                   .then((error) => {
                       if(!error){
                           ToastAndroid.show('收藏成功',ToastAndroid.SHORT);
                           this.setState({
                               isFavorite:true,
                           })
                       }
                   })
            }

        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    toolbar: {
        backgroundColor: '#00a2ed',
        height: 56,
    },
    header: {
        height: HEADER_SIZE,
    },
    headerImage: {
        height: HEADER_SIZE,
        flexDirection: 'row',
        backgroundColor: '#DDDDDD',
    },
    titleContainer: {
        flex: 1,
        alignSelf: 'flex-end',
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    title: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: 'white',
    },
});

