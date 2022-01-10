import React, {useEffect} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/style';
import { Icon } from 'react-native-elements';

//google 로그인
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const Login = ({navigation}) => {
    const onPressEmailLogin = ()=>{
      navigation.navigate("LoginEmail")
    }
    const onPressJoin = () =>{
      navigation.navigate("JoinEmail")
    }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "877649815167-8rq5c4138llk9v3mo785qee98q9hg52i.apps.googleusercontent.com",
    });
  }, []);

  async function onGoogleButtonPress() {
    const {idToken} = await GoogleSignin.signIn(); //구글 로그인하며 유저 idToken 가져옴.
    const googleCredential = auth.GoogleAuthProvider.credential(idToken); //유저 idToken 이용하여 google credential 생성
    return auth().signInWithCredential(googleCredential);                 //생성된 credential 이용해 사용자 앱으로 로그인 시킴.
  }

    return (
        <View style={styles.container}>
            <View style={{marginTop:110}}>
              <TouchableOpacity
                style={{flexDirection: 'row',
                        alignItems: "center",
                        width: '100%',
                        minWidth : 125,          //최소 너비
                        minHeight : 56,
                        borderWidth : 2,
                        borderColor : 'black'
                      }}
                onPress={()=>console.log("페이스북으로 로그인")}
                activeOpacity={0.8}>
                <Image style={{width: 30, height: 30, margin : 10}} source={require('../../assets/facebook.png')}/>  
                <Text style={{margin : 10}}>
                  페이스북으로 로그인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row',
                        alignItems: "center",
                        width: '100%',
                        minWidth : 125,          //최소 너비
                        minHeight : 56,
                        marginTop : 10, 
                        borderWidth : 2,
                        borderColor : 'black'
                      }}
                onPress={()=>{
                  console.log("구글로 로그인");
                  onGoogleButtonPress();
                }}
                activeOpacity={0.8}>
                <Image style={{width: 30, height: 30, margin : 10}} source={require('../../assets/google.png')} resizeMode='cover'/>   
                <Text style={{margin : 10}}>
                  구글로 로그인
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        minWidth : 125,          //최소 너비
                        minHeight : 56,
                        marginTop : 10,
                        borderWidth : 2,
                        borderColor : 'black',
                      }}
                onPress={onPressEmailLogin}
                activeOpacity={0.8}>
                <Icon style={{margin : 10}} name='mail' size={25} type='ant-design' />  
                <Text style={{margin : 10}}>
                  이메일로 로그인
                </Text>
              </TouchableOpacity>
              <View style={{alignItems:'center',marginTop:60}}>
                <Text
                  style={styles.textUseCondition}
                  onPress={onPressJoin}>
                  {"  회원가입  "}
                </Text>
              </View>
            </View>
        </View>
    );
};
// const styles = StyleSheet.create({
//   justifyContent : 'center',
//         alignItems: "center",
//         width: '100%',
//         minWidth : 125,          //최소 너비
//         minHeight : 56,          //최소 높이
//         borderWidth : 2,         //테두리 굵기
//         borderColor : 'black',   //테두리
//         backgroundColor : '#E7D9FF',   //배경
// });
export default Login;

