import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    AsyncStorage
    } from 'react-native';

const API_COVER_URL = 'http://news-at.zhihu.com/api/4/start-image/1080*1776';
const API_LATEST_URL = 'http://news-at.zhihu.com/api/4/news/latest';
const API_HOME_URL = 'http://news.at.zhihu.com/api/4/news/before/';
const API_THEME_URL = 'http://news-at.zhihu.com/api/4/theme/';
const API_THEMES_URL = 'http://news-at.zhihu.com/api/4/themes';

const KEY_COVER = '@Cover';
const KEY_THEMES = '@Themes:';
const KEY_HOME_LIST = '@HomeList:';
const KEY_THEME_LIST = '@ThemeList:';
const KEY_THEME_TOPDATA = '@ThemeTop:';

Date.prototype.toStringWithYYYYMMDD = function(){
    let yyyy = this.getFullYear().toString();
    let mm = (this.getMonth()+1).toString();
    let dd = this.getDay().toString();
    return yyyy+(mm[1]?mm:'0'+mm[0])+(dd[1]?dd:'0'+dd[0]);
}

function parseDateFromYYYYMMDD(str:string){
    if(!str) return new Date();
    return new Date(str.slice(0,4),str.slice(4,6)-1,str.slice(6,8));

}

export default class DataRepository {

    constructor() {

    }

    updateCover(){
        fetch(API_COVER_URL)
            .then((response) => response.json())
            .then((data) => {
                AsyncStorage.setItem(KEY_COVER,JSON.stringify(data))
            })
            .catch((error) => {
                console.error(error)
            })
            .done();
    }

    getCover(){
        return this.getItemFromStorage(KEY_COVER);
    }

    getItemFromStorage(key : string){
        return new Promise((resolve,reject) => {
            AsyncStorage.getItem(key,(error,result) => {
                let data = JSON.parse(result);
                if(error){
                    console.error(error);
                    resolve(null);
                } else {
                    resolve(data);
                }
            })
        })
    }

    saveItemToStorage(key:string,value:object){

        return new Promise((resolve,reject) => {
            AsyncStorage.setItem(key,JSON.stringify(value),(error) => {
                resolve(error);
            })
        })
    }

    removeItemFromStorage(key : string){

        return new Promise((resolve,reject) => {
            AsyncStorage.removeItem(key,(error) => {
                resolve(error);
            })
        })

    }

    getAllStoriesFromStorage() {
        let stories = [];
        return new Promise((resolve,reject) => {
            AsyncStorage.getAllKeys((error,keys) => {
                if (!error) {
                    AsyncStorage.multiGet(keys,(error,stores) => {
                        if(!error) {
                            stores.map((result,i,store) => {

                                let value = store[i][1];
                                let data = JSON.parse(value);
                                if(data.title && data.id) {
                                    stories.push(data);
                                }
                            });
                            if(stories.length > 0){
                                resolve(stories);
                            } else {
                                resolve(null);
                            }
                        } else {
                            resolve(null);
                        }

                    });
                } else {
                    resolve(null);
                }
            });
        })
    }

    safeFetch(url:string) {
        console.log('URL-->',url);
        return new Promise((resolve,reject) => {
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    resolve(data);
                })
                .catch((error) => {
                    console.error(error);
                    resolve(null);
                })
        })
    }

    getThemes(){
        return this.getItemFromStorage(KEY_THEMES)
            .then((result) => {
                if(!result){
                    return this.safeFetch(API_THEMES_URL)
                        .then((themes) => {
                            AsyncStorage.setItem(KEY_THEMES,JSON.stringify(themes));
                            console.log(themes);
                            return themes;
                        })
                } else {
                    return result;
                }
            }).then((data) => {
                let themes = [];
                if(data.subscribed != []){
                    let theme;
                    let length = data.subscribed.length
                    for(let item in data.subscribed){
                        theme = item;
                        theme.subscribed = true;
                        themes.push(theme);
                    }
                }

                if(data.others){
                    themes = themes.concat(data.others);
                }
                return themes;
            });
    }

    getStories(){
        return this.safeFetch(API_LATEST_URL);
    }

    getThemeStories(themeId : string){
        let url = API_THEME_URL+themeId;
        return this.safeFetch(url);
    }

    getStoriesWithDate(date : string){
        let url = API_HOME_URL + date;
        console.log(url);
        return this.safeFetch(url)
    }

    getThemeStoriesWithLastID(themeId,lastStoryId){
        let url = `${API_THEME_URL+themeId}/before/${lastStoryId}`;
        console.log(url);
        return this.safeFetch(url);

    }

}