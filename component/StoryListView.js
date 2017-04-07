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
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    Alert,
    Dimensions,
    ActivityIndicator,
    } from 'react-native';
import DataRepository from '../api/DataRepository.js';
const ViewPager = require('react-native-viewpager');
const dataRepository = new DataRepository();
const {width,height} = Dimensions.get('window');

var GiftedListView = require('react-native-gifted-listview');

Date.prototype.toStringWithYYYYMMDD = function(){
    let yyyy = this.getFullYear().toString();
    let mm = (this.getMonth()+1).toString();
    let dd = this.getDate().toString();
    return yyyy+(mm[1]?mm:'0'+mm[0])+(dd[1]?dd:'0'+dd[0]);
}
var lastStoryId = null,isFinished = true,newsPage = 1,postData=null;
export default class StoryListView  extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isLoading:true,
            dataSource:new ListView.DataSource({rowHasChanged(){(r1,r2) => r1 !== r2}}),
            headerDataSource:new ViewPager.DataSource({
                pageHasChanged() {(p1,p2) => p1 !== p2}
            }),
            isLoadMore:false,
            themeData:null,
            theme:this.props.theme,
        };
      }

    static get defaultProps(){
        return {
            theme:null,
        }
    }

    render() {
        {/*
         <ListView
         style={styles.listView}
         dataSource={this.state.dataSource}
         renderRow={(rowData) => this.renderRow(rowData)}
         showsVerticalScrollIndicator={false}
         renderHeader={() => this.renderHeader()}
         onEndReachedThreshold={5}
         onEndReached={() => {
         console.log('pull up to load more');
         if(isFinished) this.loadMoreStories();
         }}
         />
         */}
        return (
            <View style={{flex:1}}>
                {/*
                 <ListView
                 style={styles.listView}
                 dataSource={this.state.dataSource}
                 renderRow={(rowData) => this.renderRow(rowData)}
                 showsVerticalScrollIndicator={false}
                 renderHeader={() => this.renderHeader()}
                 onEndReachedThreshold={5}
                 onEndReached={() => {
                 console.log('pull up to load more');
                 if(isFinished) this.loadMoreStories();
                 }}
                 />
                 */}
                <GiftedListView
                    rowView={(rowData) => this.renderRow(rowData)}
                    onFetch={this.onFetch.bind(this,this.state.theme)}
                    firstLoader={true} // display a loader for the first fetching
                    pagination={true} // enable infinite scrolling using touch to load more
                    refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
                    withSections={false} // enable sections
                    enableEmptySections={true}
                    showsVerticalScrollIndicator={false}
                    customStyles={{
                   paginationView: {
                   backgroundColor: 'white',
                   },
                   }}
                    refreshableTintColor="blue"
                    style={styles.listView}
                    renderHeader={() => this.renderHeader()}
                    />
            </View>
        );
    }

    componentDidMount() {
        console.log('componentDidMount',this.props.theme);
        //this.fetchStories(this.props.theme);
    }

    componentWillReceiveProps(props) {
        console.log('ReceiveProps',props.theme);
        this.setState({
            theme:props.theme,
        });
        this.onFetch(props.theme,1,postData);
    }

    fetchStories(theme){
        if(theme == null){
            dataRepository.getStories()
                .then((data) => {
                    console.log(data);
                    if(data){
                        this.setState({
                            dataSource:new ListView.DataSource({rowHasChanged(){(r1,r2) => r1 !== r2}}).cloneWithRows(data.stories),
                            headerDataSource:this.state.headerDataSource.cloneWithPages(data.top_stories),
                            isLoading:false,
                        })

                    } else {
                        this.setState({
                            isLoading:false,
                        })
                    }
                })
        } else {
            dataRepository.getThemeStories(theme.id)
                .then((data) => {
                    console.log(data);
                    let length = data.stories.length;
                    if(data) {
                        lastStoryId = data.stories[length-1].id;
                        this.setState({
                            dataSource:new ListView.DataSource({rowHasChanged(){(r1,r2) => r1 !== r2}}).cloneWithRows(data.stories),
                            isLoading:false,
                            themeData:data,
                        })

                    } else {
                        this.setState({
                            isLoading:false,
                        })
                    }
                })
        }
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

    renderHeader(){
        if(this.props.theme && this.state.themeData) {
            return (
                <View style={styles.headerView}>
                    <Image source={{uri:this.state.themeData.background}} style={styles.headerImage}>
                        <View style={styles.headerTitleView}>
                            <Text style={styles.headerTitle} numberOfLines={2}>{this.state.themeData.description}</Text>
                        </View>
                    </Image>
                </View>
            )
        } else {
            return (
                <View style={{flex:1,height:200}}>
                    <ViewPager
                        dataSource={this.state.headerDataSource}
                        style={styles.banner}
                        renderPage={(rowData) => this.renderPage(rowData)}
                        isLoop={true}
                        autoPlay={true}
                        />
                </View>
            )
        }

    }

    renderPage(rowData){
        return (
            <TouchableOpacity onPress={() => this.navigateToDetail(rowData)} activeOpacity={0.5}>
                <View style={styles.headerView} >
                    <Image source={{uri:rowData.image?rowData.image:null}} style={styles.headerImage}>
                        <View style={styles.headerTitleView}>
                            <Text style={styles.headerTitle} numberOfLines={2}>{rowData.title}</Text>
                        </View>
                    </Image>
                </View>
            </TouchableOpacity>
        )

    }

    showProgressView(){
        if(this.state.isLoadMore) {
            console.log('showProgressView');
            return (
                <View style={styles.progressView}>
                    <ActivityIndicator color='orange'/>
                </View>
            )
        }
    }

    navigateToDetail(story){
        this.props.navigator.push({
            title: story.title,
            name: 'story',
            story: story,
        });
    }

    loadMoreStories(){
        isFinished = false;
        if(this.props.theme == null){
            let nowDate = new Date();
            nowDate.setDate(nowDate.getDate() - this.state.count);
            console.log(nowDate.toStringWithYYYYMMDD());
            dataRepository.getStoriesWithDate(nowDate.toStringWithYYYYMMDD())
                .then((data) => {
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(data.stories),
                        count:++this.state.count,
                    });
                    isFinished = true;
                })
        } else {
            if(!lastStoryId) return;
            console.log(lastStoryId);
            dataRepository.getThemeStoriesWithLastID(this.props.theme.id,lastStoryId)
              .then((data) => {
                    let length = data.stories.length;
                    console.log('getThemeStoriesWithLastID',data,data.stories[length-1].id);
                    lastStoryId = data.stories[length-1].id;
                    this.setState({
                        dataSource:this.state.dataSource.cloneWithRows(data.stories),
                    })
                    isFinished = true;

                })
        }
    }

    onFetch(theme,page = 1, callback, options) {
        if(!postData) postData = callback;
        if(page == 1) {
            if(theme == null){
                dataRepository.getStories()
                    .then((data) => {
                        console.log(data);
                        if(data){
                            this.setState({
                                headerDataSource:this.state.headerDataSource.cloneWithPages(data.top_stories),
                            })
                            callback(data.stories);

                        } else {
                            callback([]);
                        }
                    })
            } else {
                dataRepository.getThemeStories(theme.id)
                    .then((data) => {
                        console.log(data);
                        let length = data.stories.length;
                        if (data) {
                            lastStoryId = data.stories[length - 1].id;
                            this.setState({
                                themeData: data,
                            });
                            callback([]);
                            callback(data.stories);
                        }
                    })
            }

        } else {
                if(theme == null){
                    let nowDate = new Date();
                    nowDate.setDate(nowDate.getDate() - newsPage);
                    console.log(nowDate.toStringWithYYYYMMDD());
                    dataRepository.getStoriesWithDate(nowDate.toStringWithYYYYMMDD())
                        .then((data) => {
                            callback(data.stories);
                            ++newsPage;
                        })
                } else {
                    if(!lastStoryId) return;
                    console.log(lastStoryId);
                    dataRepository.getThemeStoriesWithLastID(theme.id,lastStoryId)
                        .then((data) => {
                            let length = data.stories.length;
                            console.log('getThemeStoriesWithLastID',data,data.stories[length-1].id);
                            lastStoryId = data.stories[length-1].id;
                            callback(data.stories)
                        })
                }
        }
    }


}

const styles = StyleSheet.create({
    loadingView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    listView:{
        backgroundColor:'white',
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
    headerView:{
        flex:1,
        height:200,
    },
    headerImage:{
        flex:1,
        height:200,
    },
    headerTitleView:{
        flex:1,
        justifyContent:'flex-end',
        padding:10,
        backgroundColor:'rgba(0,0,0,0.2)'
    },
    headerTitle:{
        fontSize:18,
        fontWeight:'500',
        color:'white',
        marginBottom:10,
    },
    progressView:{
        position:'absolute',
        width:width/2,
        height:width/2,
        justifyContent:'center',
        alignItems:'center',
        left:width/4,
        bottom:(height - width/2)/2,
        backgroundColor:'white',

    },


});

