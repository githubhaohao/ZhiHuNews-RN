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
    ListView,
    Image,
    TouchableHighlight,
    ToolbarAndroid,
    Dimensions,
    } from 'react-native';
import DataRepository from '../api/DataRepository.js';
const dataRepository = new DataRepository();
const {width,height} = Dimensions.get('window');
const GiftedListView = require('react-native-gifted-listview');
const toolbarActions = [
    {title: '夜间模式', show: 'never'},
    {title: '设置选项', show: 'never'},
    {title: '用户反馈', show: 'never'},
    {title: '关于项目', show: 'never'},
];

export default class FavoriteStoryView extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged(r1,r2){
                return r1 !== r2;
            }}),
            hasFavorite:true,
        };
      }
    render() {
        let toolBar = <ToolbarAndroid
            navIcon={require('image!ic_back_white')}
            title='我的收藏'
            titleColor="white"
            style={styles.toolbar}
            actions={toolbarActions}
            onIconClicked={() => {this.props.navigator.pop()}}
            />;
        if(this.state.hasFavorite) {
            return (
                <View style={styles.container}>
                    {toolBar}
                    <GiftedListView
                        rowView={(rowData) => this.renderRow(rowData)}
                        withSections={false} // enable sections
                        enableEmptySections={true}
                        showsVerticalScrollIndicator={false}
                        style={{flex:1, backgroundColor: 'white',marginTop:5,}}
                        firstLoader={true} // display a loader for the first fetching
                        pagination={false} // enable infinite scrolling using touch to load more
                        refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                        onFetch={this.onFetch.bind(this)}
                        />

                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    {toolBar}
                    <View style={[styles.container,{justifyContent:'center',alignItems: 'center',backgroundColor:'white'}]}>
                        <Text style={{fontSize:16,color:'black'}}>您还未添加收藏</Text>
                    </View>
                </View>

            )

        }

    }

    componentDidMount() {
    }

    renderRow(rowData){
        let uri = null;
        if(rowData.images && rowData.images[0]){
            uri = rowData.images[0];
        } else {
            uri = 'screen';
        }

        return (
            <View style={{height:100,paddingTop:5,paddingBottom:5,paddingLeft:10,paddingRight:10}}>
                <TouchableHighlight underlayColor='#9f9f9f' onPress={() => this.navigateToDetail(rowData)}>
                    <View style={styles.listViewItem}>
                        <Image source={{uri:uri}} style={styles.itemIcon}/>
                        <Text style={styles.itemTitle}>{rowData.title}</Text>
                    </View>
                </TouchableHighlight>
            </View>

        )
    }

    navigateToDetail(story){
        this.props.navigator.push({
            title: story.title,
            name: 'story',
            story: story,
        });
    }

    onFetch(page = 1,callBack,options){
        if(page == 1) {
            dataRepository.getAllStoriesFromStorage()
                .then((data) => {
                    if(data) {
                        console.log("getAllStoriesFromStorage",data);
                        callBack(data);
                    } else {
                        this.setState({
                            hasFavorite:false,
                        })
                    }
                })
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listView:{
        backgroundColor:'white',
        flex:1,
        marginTop:5,
    },
    listViewItem:{
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#efefef',
        borderWidth:0.5,
        borderColor:'#dfdfdf',
        height:90,
        width:width - 20,
        borderRadius:6,
    },
    itemIcon:{
        width:90,
        height:90,
        borderBottomLeftRadius:6,
        borderTopLeftRadius:6,
    },
    itemTitle:{
        marginRight:10,
        marginLeft:10,
        flex:1,
        fontSize:18,
        color:'black',
    },
    toolbar: {
        backgroundColor: '#00a2ed',
        height: 56,
    },

});

