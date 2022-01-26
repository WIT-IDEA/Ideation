import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert
} from 'react-native';
import {Button, Header, Card, Icon} from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
//import { fetchPost, deletePost, snapshotPost} from '../actions';  //현재 코드에서 사용하지 않음
import { TextInput } from 'react-native-gesture-handler';
import Search from 'react-native-vector-icons/Ionicons';
import Sort from 'react-native-vector-icons/Fontisto';
import IdeaComponent from '../components/Idea';
//import { fetchPost } from '../actions';
import { transform } from '@babel/core';
//import { Icon } from 'react-native-elements';

const idealist = ({route,navigation}) => {
  const ideas = [];
  const {userUid} = route.params;
  const [post, setPost] = useState([])
  const [postSearch, setPostSearch] = useState([])
  const [postFilter, setPostFilter] = useState([])
  const sortList = ['','생성 순 ','수정 순 ','이름 순 ']
  const [index, setIndex] = useState(0)
  const [deleted, setDeleted] = useState(false)
  const [search, setSearch] = useState('')

  const getPosts = async (userUid) => {
    const list = []
    await firestore()
        .collection('userIdeaData')
        .doc(userUid)
        .collection('item')
        .orderBy('updateTime','desc')
        .get()
        .then((querySnapshot)=>{
          querySnapshot.forEach((doc)=>{
            let postData = doc.data(); //문서 1개
            postData.postId = doc.id; //문서 id
            list.push(postData);
          })
        })
    setPost(list)
    setPostFilter(list)
    setPostSearch(list)
    console.log("list",list)
  }
  const deletePost = (postId) => {
    console.log('Current Post Id: ', postId);
    firestore()
      .collection('userIdeaData')
      .doc(userUid)
      .collection('item')
      .doc(postId)
      .get()
      .then((documentSnapshot)=>{
        if(documentSnapshot.exists){
          console.log('exist')
          firestore()
            .collection('userIdeaData')
            .doc(userUid)
            .collection('item')
            .doc(postId)
            .delete()   //firestore 에서 삭제
            .then(()=>{
              Alert.alert('Delete','삭제 되었습니다',);
              setDeleted(true);
            })
            .catch((error)=>console.log('deletePost',error))
        }
      })
  }
  useEffect(()=>{
    getPosts("userUid",userUid);
  },[])
  useEffect(()=>{
    getPosts(userUid);  //삭제 후 서버에서 데이터 다시
    setDeleted(false);
  },[deleted])
  //백 버튼
  useFocusEffect(
    useCallback(()=>{
      const backHandler = BackHandler.addEventListener("hardwareBackPress",
        ()=>{
          Alert.alert("Stop","앱을 종료하시겠습니까?",[{text: "아니오", onPress: ()=> null, style:"cancel"},{text:"네", onPress: ()=> {BackHandler.exitApp()}}]);
          return true;
        })
      return () => backHandler.remove();
    },[])   
  )
  const getToday = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0"+(1+date.getMonth())).slice(-2)
    var day = ("0"+date.getDate()).slice(-2)
    return year+"."+month+"."+day
  }
  const searchTitle = (text) => {
    if(text){
      const tmpPost = post.filter(item=>item.title.includes(text))
      setPostSearch(tmpPost)
      setPostFilter(tmpPost)
    }else{
      setPostSearch(post)
      setPostFilter(post)
    }
  }
  const plusIndex = ()=>{
    var idx = index
    if (index < 3){
      idx = index+1
      setIndex(index+1)
    }else{
      idx = 0
      setIndex(0)
    }
    filterItem(idx)
  }
  const filterItem = (idx)=>{
    const tmpPost = postSearch
    console.log(idx)
    switch(idx){
      case 1: //생성
        tmpPost.sort((a,b)=>a.createTime-b.createTime)
        setPostFilter(tmpPost)
        break;
      case 2: //수정
        tmpPost.sort((a,b)=>a.updateTime-b.updateTime)
        setPostFilter(tmpPost)
        break;
      case 3: //이름
        tmpPost.sort((a,b)=>a.title>b.title?1:-1)
        setPostFilter(tmpPost)
        break;
      default:
        setPostFilter(postSearch)
        break;
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            numberOfLines={1}
            // autoComplete='off'  //키보드 자동완성 끄기
            placeholder='아이디어 이름을 검색해보세요.'
            //value={search}
            onChangeText={searchTitle}>
          </TextInput>
          <TouchableOpacity disabled={true}>
            <Search style={{marginEnd:15, transform:[{rotate: '15deg'}]}} name='ios-search' size={22} color="#000"/>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flexDirection:'row',justifyContent: 'space-between', alignItems: 'center', marginHorizontal:15, marginVertical:5}}>
        <Text style={{fontSize:30}}>
          Puzzles
        </Text>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <Text style={{fontSize:20}}>{sortList[index]}</Text>
          <TouchableOpacity onPress={plusIndex}>
            <Sort style={{marginEnd:12, transform:[{rotate: '270deg'}]}} name='arrow-swap' size={22} color="#000"/>
          </TouchableOpacity>
        </View>
      </View>
      <View>
      </View>
      <FlatList
        data={postFilter}
        renderItem={({item})=>(
          <IdeaComponent
            item={item}
            onDelete={deletePost}
            />
        )}
        keyExtractor={(item)=>item.postId}
        style={{paddingHorizontal: 15}}>
      </FlatList>
      <TouchableOpacity
        style={styles.touchableOpacity}
        // onPress={()=>{navigation.navigate("ideamatching")}}
        >
        <Image
          style={styles.plus}
          source={{uri: 'https://raw.githubusercontent.com/tranhonghan/images/main/plus_icon.png'}}/>
      </TouchableOpacity>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //margin: 10
    //marginTop: StatusBar.currentHeight || 0,  //상태바 높이만큼 낮추는 코드
  },
  searchContainer:{
    flex:1,
    borderColor:'#000',
    borderWidth:1,
    height:50,
    marginTop:15,
    flexDirection:'row',
    alignItems:'center'
  },
  searchInput:{
    flex:1,
    borderStyle:'solid',
    padding:0,
    margin:0,
    marginHorizontal:5,
    fontSize:20
  },
  header: {
    flexDirection: 'row',
    //borderBottomColor: 'black',
    //borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    margin: 15
  },
  card_button_row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  CenterComponent: {
    fontSize: 24,
  },
  touchableOpacity: {
    position:'absolute',
    width:50,
    height:50,
    alignItems:'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30
  },
  plus:{
    resizeMode: 'contain',
    width: 50,
    height: 50
  },
});

export default idealist;
