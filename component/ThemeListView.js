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
    TouchableHighlight,
    ListView,
    Image,
    TouchableNativeFeedback,
    TouchableOpacity,
    } from 'react-native';
import DataRepository from '../api/DataRepository.js';
const dataRepository = new DataRepository();
const THEME_COLOR = '#00a2ed';

export default class ThemeListView extends Component {

    static get defaultProps(){
        return{
            onItemClickListener:null,
            onClickMyFavorite:null,
        }
    }
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged(r1,r2){
                return r1 !== r2;
            }}),
            isLoading:true,
        };
      }

    render() {
        return (
            <View style={styles.container}>
                <ListView
                    ref='themeListView'
                    dataSource={this.state.dataSource}
                    renderRow={(rowData) => this.renderRow(rowData)}
                    automaticallyAdjustContentInsets={false}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={true}
                    showsVerticalScrollIndicator={false}
                    renderHeader={() => this.renderHeader()}
                    style={{flex:1, backgroundColor: 'white'}}
                    />
            </View>
        );
    }

    renderRow(rowData : Object){
        let icon = rowData.subscribed ? 'ic_menu_arrow' : 'ic_menu_follow';
        return(
            <TouchableHighlight underlayColor='#efefef' onPress={() => this.onClickCallBack(rowData)}>
                <View style={styles.itemView}>
                  <Text style={styles.itemTitle}>{rowData.name}</Text>
                  <Image style={styles.itemIcon} source={{uri:rowData.thumbnail}}/>
                </View>
            </TouchableHighlight>
        )
    }

    onClickCallBack(data){
        if(this.props.onItemClickListener == null) return;
        this.props.onItemClickListener(data);

    }

    renderHeader(){
        return (
            <View style={styles.headerView}>
                <View style={styles.userInfo}>
                    <Image source={{uri:'user'}} style={{width:50,height:50,marginLeft:16,marginRight:16,borderRadius:25}}/>
                    <Text style={{fontSize:18,color:'white'}}>立即登录</Text>
                    <Image source={{uri:'login'}} style={{width:25,height:25,marginLeft:10}}/>
                </View>
                <View style={styles.middleView}>
                    <TouchableOpacity style={{flex:1}} activeOpacity={0.6} onPress={() => {this.clickMyFavorite()}}>
                        <View style={styles.middleLeftView}>
                            <Image source={{uri:'star_white'}} style={{width:25,height:25}}/>
                            <Text style={{fontSize:16,color:'white',marginLeft:10}}>我的收藏</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.middleRightView}>
                        <Image source={{uri:'download'}} style={{width:20,height:20}}/>
                        <Text style={{fontSize:16,color:'white',marginLeft:10}}>离线下载</Text>
                    </View>
                </View>
                <TouchableHighlight underlayColor='#efefef' onPress={() => this.onClickCallBack(null)}>
                    <View style={styles.bottomView}>
                        <Image source={{uri:'home'}} style={{width: 30, height: 30, marginLeft: 16}} />
                        <Text style={{fontSize:16,color:THEME_COLOR,marginLeft:16}}>首页</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }

    clickMyFavorite(){
        if(this.props.onClickMyFavorite == null) return;
        this.props.onClickMyFavorite();
    }

    componentDidMount() {
        this.fetchThemes();
    }

    fetchThemes(){
        dataRepository.getThemes()
          .then((themes) => {
                this.setState({
                    isLoading:false,
                    dataSource:this.state.dataSource.cloneWithRows(themes),
                })
            })
          .catch((error) => {
                console.error(error);
                this.setState({
                    isLoading:false,
                })
            })
          .done();
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    itemView:{
        flexDirection:'row',
        height:55,
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:16,
        paddingRight:16,
        borderBottomColor:'#efefef',
        borderBottomWidth:0.5,
    },
    itemTitle:{
        flex:1,
        fontSize:16,
        color:'purple',
    },
    itemIcon:{
        width:36,
        height:36,
        borderRadius:18,
    },
    headerView:{
        height:210,
    },
    userInfo:{
        height:100,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:THEME_COLOR,
        borderBottomColor:'#00a6ef',
        borderBottomWidth:0.5,
    },
    middleView:{
        height:55,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:THEME_COLOR,
        paddingLeft:16,
    },
    middleLeftView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    middleRightView:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
    },
    bottomView:{
        height:55,
        flexDirection:'row',
        alignItems:'center',
        borderBottomColor:'#efefef',
        borderBottomWidth:0.5,
    },

});

