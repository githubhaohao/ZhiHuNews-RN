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
    DrawerLayoutAndroid,
    ToolbarAndroid,
    ToastAndroid,
    BackAndroid,
    TouchableOpacity,
    Dimensions,
    StatusBar
    } from 'react-native';
import ThemeListView from './ThemeListView.js';
import StoryListView from './StoryListView.js';
const {width,height,scale} = Dimensions.get('window');
const DRAWER_REF = 'drawer';
const DRAWER_WIDTH_LEFT = 56;
const toolbarActions = [
    {title: '提醒', icon: require('image!star_red'), show: 'always'},
    {title: '夜间模式', show: 'never'},
    {title: '设置选项', show: 'never'},
    {title: '用户反馈', show: 'never'},
    {title: '关于项目', show: 'never'},
];
export default class MainView extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            theme:null,
        };
      }

    render() {
        let title = this.state.theme != null ? this.state.theme.name : '首页';
        return (
            <DrawerLayoutAndroid
                ref={DRAWER_REF}
                drawerWidth={width - DRAWER_WIDTH_LEFT}
                keyboardDismissMode="on-drag"
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => this.renderNavigationView()}
                >
                <View style={styles.matchParent}>
                    <StatusBar
                        backgroundColor="#00a2ed"
                        barStyle="light-content"
                        />
                    <ToolbarAndroid
                        navIcon={require('image!ic_menu_white')}
                        title={title}
                        titleColor="white"
                        style={styles.toolbar}
                        actions={toolbarActions}
                        onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}
                        onActionSelected={(position) => this.onActionSelected(position)} />
                    <View style={styles.container}>
                        <StoryListView theme={this.state.theme} navigator={this.props.navigator}/>
                    </View>

                </View>

            </DrawerLayoutAndroid>

        );
    }

    renderNavigationView(){
        return (
            <ThemeListView onItemClickListener={(data) => this.onThemeListViewItemClickListener(data)}
                           onClickMyFavorite={() => {
                                this.onActionSelected(0);
                                this.refs[DRAWER_REF].closeDrawer();
                           }}
                />
        )
    }

    onThemeListViewItemClickListener(data){
        this.setState({
            theme:data,
        });
        this.refs[DRAWER_REF].closeDrawer()

    }

    onActionSelected(position){
        //alert(`position:${position}`);
        if (position == 0) {
            this.props.navigator.push({
                name: 'favorite',
            });
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    toolbar: {
        backgroundColor: '#00a2ed',
        height: 56,
    },
    matchParent:{
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

