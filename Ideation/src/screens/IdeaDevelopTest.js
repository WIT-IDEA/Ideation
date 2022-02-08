import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { PanGestureHandler, Swipeable } from "react-native-gesture-handler";
import { launchImageLibrary } from "react-native-image-picker";
import Feather from "react-native-vector-icons/Feather";
import { Col, Row, Grid } from "react-native-easy-grid";
import exampleImage1 from '../assets/rectangle1.png'
import exampleImage2 from '../assets/rectangle2.png'
import exampleImage3 from '../assets/unsplash1.png'
import exampleImage4 from '../assets/unsplash2.png'
import exampleImage5 from '../assets/unsplash3.png'
import exampleImageFrame from '../assets/frame.png'
import exampleImageFrame1 from '../assets/frame1.png'
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  runOnJS,
  withTiming,
  Value
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window"); //안드로이드는 상태바를 포함하지 않고 영역 추출함
const COL = 4;
const ROW = 6;
const circleSize = width - 36;
//const itemSize = width / 4; //네모칸의 가로 세로 크기
const radius = circleSize / 2 - (width / 4) / 2;
const center = radius;
const pad = 0;
const itemSizeC = width/COL; //박스 크기
// const pad = (width - (COL*(width/COL - 6)))/2;
// const itemSizeC = width/COL - 6; //박스 크기

const App = ({ navigation, route }) => {
  const [movingDraggable, setMovingDraggable] = useState(null);
  const [releaseDraggable, setReleaseDraggable] = useState(null);
  const [init, setInit] = useState(false);
  //const [onOff, setOnOff] = useState(false)
  const [items, setItems] = useState([]);
  const uri1 = Image.resolveAssetSource(exampleImage1).uri;
  const uri2 = Image.resolveAssetSource(exampleImage2).uri;
  const uri3 = Image.resolveAssetSource(exampleImage3).uri;
  const uri4 = Image.resolveAssetSource(exampleImage4).uri;
  const uri5 = Image.resolveAssetSource(exampleImage5).uri;
  const MaxRows = 6;
  const MaxColumns = 4;
  
  const blankMatrix = useRef([]);
  //console.log('렌더링.onoff:',onOff, blankMatrix.current)
  useEffect(()=>{
    blankMatrix.current = [
      [uri1, 0, uri2, 0],
      [0, uri3, "뷰티", 0],
      ["건축", 0, uri4, 0],
      [0, uri1, 0, 0],
      [0, uri2, 0, 0],
      [0, 0, 0, uri5]
    ]
    // position={{x:j*itemSizeC, y: i*itemSizeC}}
    // blankMatrix.current = [
    //   [ {value:uri1, x:0,           y:0},
    //     {value:0,    x:itemSizeC,   y:0},
    //     {value:uri2, x:2*itemSizeC, y:0},
    //     {value:0,    x:3*itemSizeC, y:0}],
    //   [ {value:0,    x:0,           y:1*itemSizeC},
    //     {value:0,    x:itemSizeC,   y:1*itemSizeC},
    //     {value:0,    x:2*itemSizeC, y:1*itemSizeC},
    //     {value:0,    x:3*itemSizeC, y:1*itemSizeC}],
    //   [ {value:0,    x:0,           y:2*itemSizeC},
    //     {value:0,    x:itemSizeC,   y:2*itemSizeC},
    //     {value:0,    x:2*itemSizeC, y:2*itemSizeC},
    //     {value:0,    x:3*itemSizeC, y:2*itemSizeC}],
    //   [ {value:0,    x:0,           y:3*itemSizeC},
    //     {value:0,    x:itemSizeC,   y:3*itemSizeC},
    //     {value:0,    x:2*itemSizeC, y:3*itemSizeC},
    //     {value:0,    x:3*itemSizeC, y:3*itemSizeC}],
    //   [ {value:0,    x:0,           y:4*itemSizeC},
    //     {value:0,    x:itemSizeC,   y:4*itemSizeC},
    //     {value:0,    x:2*itemSizeC, y:4*itemSizeC},
    //     {value:0,    x:3*itemSizeC, y:4*itemSizeC}],
    //   [ {value:0,    x:0,           y:5*itemSizeC},
    //     {value:0,    x:itemSizeC,   y:5*itemSizeC},
    //     {value:0,    x:2*itemSizeC, y:5*itemSizeC},
    //     {value:0,    x:3*itemSizeC, y:5*itemSizeC}]
    // ]
    setInit(true)
    //console.log("마운트")
  },[])
  const pickImageFromPhone = () => {
    const options = {
      title: "Select Avatar",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    launchImageLibrary(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // setProcessing(false)
        console.log("User cancelled image picker");
      } else if (response.error) {
        // setProcessing(false)
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        // setProcessing(false)
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log('Response = ', response.assets[0].uri);
        const tmp = response.assets[0];
        const source = {
          uri:
            Platform.OS === "android"
              ? tmp.uri
              : tmp.uri.replace("file://", ""),
          fileName: response.fileName,
        };
        var arr = [...items];
        console.log("source.uri",source.uri)
        arr.push(source.uri);
        setItems(arr);  ////xxxxx
      }
    });
  };
  
  // const degToRad = (deg) => {
  //   return (deg * Math.PI) / 180;
  // };
  // const setup = (index) => {
  //   const dividedAngle = 360 / items.length;
  //   const angleRad = degToRad(270 + index * dividedAngle);
  //   const x = radius * Math.cos(angleRad) + center;
  //   const y = radius * Math.sin(angleRad) + center;
  //   return { x, y };
  // };
  // const onMovingDraggable = (movingDraggable) => {
  //   setMovingDraggable(movingDraggable);
  // };
  // const onReleaseDraggable = (releaseDraggable) => {
  //   setMovingDraggable(null);
  //   setReleaseDraggable(releaseDraggable);
  // };
  // const swap = (index1, index2) => {
  //   var arr = [...items];
  //   var temp = arr[index1];
  //   arr[index1] = arr[index2];
  //   arr[index2] = temp;
  //   console.log("swap 전",arr)
  //   setItems(arr);
  //   console.log("swap 후",items)
  // };
  // const deleteItem = (index) => {
  //   var arr = [...items];
  //   arr.splice(index, 1);
  //   setItems(arr);
  // };

  useEffect(()=>{
    console.log('idea test')
  },[])
  
  //#FFF4D9 노란색 #E7D9FF 보라색 매인컬러 #D9E3FF 파란색 #FFD9D9 분홍색
  const Square = ({row, col }) => {
    const backgroundColor = '#fdf8ff';
    return (
      <View
        style={{
          flex: 1,
          backgroundColor,//padding: 4,
          justifyContent: "space-between",
          borderColor : "#D8D8D8", //색깔 확인
          borderWidth : 0.5,
          height: itemSizeC,
          width: itemSizeC,
        }}>
       <Image source={{uri:Image.resolveAssetSource(exampleImageFrame).uri}} style={styles.img}></Image>
       {/* {onoff === true
        ? <Image source={{uri:Image.resolveAssetSource(exampleImageFrame).uri}} style={styles.img}></Image>
        : <Image source={{uri:Image.resolveAssetSource(exampleImageFrame1).uri}} style={styles.img}></Image>
       } */}
      </View>
    );
  };
  
  const Row = ({ white, row }) => {
    const offset = white ? 0 : 1;
    return (
      <View style={{
        flex: 1,
        flexDirection: "row",
        //backgroundColor : "#fdf8ff"
        }}>
        {new Array(4).fill(0).map((_, i) => (
          <Square row={row} col={i} key={i} white={(i + offset) % 2 === 1}/>
        ))}
      </View>
    );
  };
  const Background = () => {
    return (
      <View style={{ flex:1}}>
        {new Array(6).fill(0).map((_, i) => (
          // <Row key={i} white={i % 2 === 0} row={i} onoff={onOff}/>
          <Row key={i} white={i % 2 === 0} row={i}/>
        ))}
      </View>
    );
  };
  const swap = (to, from) => {
    blankMatrix.current[to.y][to.x] 

  }
  const Photo = ({uri,text,position})=>{
    const isGestureActive = useSharedValue(false);
    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);
    const translateX = useSharedValue(position.x);
    const translateY = useSharedValue(position.y);
    const movePiece = useCallback(
      (to,from) => {
        if (to.x >= 0 && to.x < 4 && to.y >= 0 && to.y < 6){
          //withTiming 부드럽게 움직이게함
          translateX.value = withTiming( 
            to.x*itemSizeC, {}, () => (offsetX.value = translateX.value)
          );
          translateY.value = withTiming(
            to.y*itemSizeC,{},
              () => {
            offsetY.value = translateY.value;
            isGestureActive.value = false; //zIndex 조절
          });
          //blanKMatrix값 변경
          // var temp = blankMatrix.current[from.y][from.x].value 
          // blankMatrix.current[from.y][from.x].value = blankMatrix.current[to.y][to.x].value
          // blankMatrix.current[to.y][to.x].value = temp
          // console.log("blankMatrix",blankMatrix.current)
          var temp = blankMatrix.current[from.y][from.x]
          blankMatrix.current[from.y][from.x] = blankMatrix.current[to.y][to.x]
          blankMatrix.current[to.y][to.x] = temp
          //console.log("blankMatrix",blankMatrix.current)
          //UI swap
          //swap(to, from)
          //blankMatrix.current[to.y][to.x].x = 
        } else{
          translateX.value = withTiming(
            offsetX.value,{},()=>(offsetX.value = offsetX.value)
          )
          translateY.value = withTiming(
            offsetY.value,{},()=>(offsetY.value = offsetY.value)
          )
        }
      },
      [isGestureActive, offsetX, offsetY, translateX, translateY]
    );
    const toTranslation = (x, y) => {
      return {x:y*itemSizeC, y: x*itemSizeC}
    }
    const toPosition = (obj)=>{
      // console.log("열",Math.round(y.value/itemSizeC))
      // console.log("행",Math.round(x.value/itemSizeC))
      return {x:Math.round(y/itemSizeC),y:Math.round(x/itemSizeC)}
    }
    
    const onGestureEvent = useAnimatedGestureHandler({
      onStart: () => {
        isGestureActive.value = true
        offsetX.value = translateX.value;
        offsetY.value = translateY.value;
      },
      onActive: ({translationX, translationY}) =>{
        translateX.value = translationX + offsetX.value;
        translateY.value = translationY + offsetY.value;
      },
      onEnd: () => {
        // console.log("translateX",translateX.value, "translateY", translateY.value)
        // console.log("offsetX",offsetX.value, "offsetY", offsetY.value)
        // console.log("열",Math.round(translateY.value/itemSizeC))
        // console.log("행",Math.round(translateX.value/itemSizeC))
        //translateX = 박스의 열
        //translateY = 박스의 행
        runOnJS(movePiece)(
         {x:Math.round(translateX.value/itemSizeC),y:Math.round(translateY.value/itemSizeC)},
         {x:Math.round(offsetX.value/itemSizeC),y:Math.round(offsetY.value/itemSizeC)}
        );
      },
    });
    const imageStyle = useAnimatedStyle(()=>({
      position : "absolute",
      zIndex: isGestureActive.value ? 100 : 0,
      width: itemSizeC,
      height: itemSizeC,
      transform:[
        {translateX: translateX.value},
        {translateY: translateY.value}
      ]
    }))
    const textStyle = useAnimatedStyle(()=>({
      position : "absolute",
      justifyContents: 'center',
      // flexDirection : 'column',
      alignContent : 'center',
      alignItems: 'center',
      backgroundColor : '#D9E3FF',
      zIndex: isGestureActive.value ? 100 : 0,
      width: itemSizeC,
      height: itemSizeC,
      borderRadius : 30,
      transform:[
        {translateX: translateX.value},
        {translateY: translateY.value}
      ]
    }))
    const underlay = useAnimatedStyle(() => {
      const position = {x:Math.round(translateX.value/itemSizeC), y:Math.round(translateY.value/itemSizeC)};
      const translation = {x:position.x*itemSizeC, y:position.y*itemSizeC};
        return {
          position: "absolute",
          width: itemSizeC,
          height: itemSizeC,
          zIndex: 0,
          backgroundColor: isGestureActive.value
            ? (position.x >= 0 && position.x < 4 && position.y >= 0 && position.y < 6 ? "rgba(255, 255, 0, 0.5)" : "transparent")
            : "transparent",
          transform: [{ translateX: translation.x }, { translateY: translation.y }],
        };
    });
    return(
      <>
      {/* <Animated.View style={underlay}/> */}
      <PanGestureHandler onGestureEvent={onGestureEvent}>
      {uri.match(/.(jpeg|jpg|gif|png)/)
      ? (
        <Animated.View style={imageStyle}>
        <Image
          source={{uri:uri}}
          style={{
            width: itemSizeC,  
            height: itemSizeC,
          }}/>
        </Animated.View>
      )
      : ( 
        <Animated.View style={textStyle}>
          <Text style={{
            width: itemSizeC,  
            height: itemSizeC,
            textAlign:'center',
            textAlignVertical:'center',
            fontSize:24,
            borderRadius: 30,
            alignContent : 'center',
            fontFamily:'SB_Aggro_L',
          }}>
          {text.split(' ')[0]}
          </Text>
        </Animated.View>
      )}
      </PanGestureHandler>
      </>
    )
  }

  const translationYbottom = useSharedValue(0);
  const velocityYbottom = useSharedValue(0);
  // const onGestureEvent = onGestureEvent({
  //   translationYbottom,
  //   velocityYbottom
  // })
  const onGestureEventBottom = useAnimatedGestureHandler({
    onStart: () => {
      //isGestureActive.value = true
      //offsetX.value = translateX.value;
    },
    onActive: ({translationX, translationY}) =>{
      //translateYBottom.value = translationX + offsetX.value;
    },
    onEnd: () => {
      // runOnJS(movePiece)(
      //  {x:Math.round(translateX.value/itemSizeC),y:Math.round(translateY.value/itemSizeC)},
      //  {x:Math.round(offsetX.value/itemSizeC),y:Math.round(offsetY.value/itemSizeC)}
      // );
    },
  });
  const translateYBottom = translationYbottom;
  return (
      <SafeAreaView style={styles.safeAreaView}>
        {/* backgroundColor:'#fdf8ff' */}
        <View style={{margin:pad, width:width-pad*2, height:itemSizeC*6}}>
          <Background/>
          {init
           ? (blankMatrix.current.map((row, i)=>
            row.map((square, j)=>{
              //console.log(square.value)
              if(square === 0){
                return null;
              }else {
                //console.log('이미지')
                return(  
                  <Photo
                    key={`${j}-${i}`}
                    position={{x:j*itemSizeC, y: i*itemSizeC}}
                    //position={{x:square.x, y: square.y}}
                    uri={square}
                    text={square}
                  />
                )
              }
            })))
            : null
          }
      </View>
      {/* <PanGestureHandler onGestureEvent={onGestureEventBottom}>
        <Animated.View
          style={{transform:[{translateYBottom}]}}>
          <Text>메모하기</Text>
        </Animated.View>
      </PanGestureHandler> */}
        <Animated.View
          style={{
            backgroundColor:'#E7D9FF',
            height:height-itemSizeC*6,
            alignItems:'center',
            justifyContent:'center'}}>
          <Text
            style={{textAlign:'center',textAlignVertical:'center'}}>
             메모하기
          </Text>
        </Animated.View>
    </SafeAreaView>
  );

};

export default App;

const styles = StyleSheet.create({
  containerX: {
    flex: 1,
    flexDirection: "row",
    //height: 20
    //height: itemSizeC,
    backgroundColor : "#fdf8ff"
  },
  randommatching: {
    flex: 2,
    backgroundColor: '#E7D9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderColor: 'black',
  },
  imgX: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  safeAreaView: {
    // flex: 1,
    backgroundColor: '#fdf8ff'//"#20232A",
  },
  viewContainer: {
    flex: 1,
    width,
    backgroundColor: "#fdf8ff"//"#20232A",
  },
  bottom:{
    width: "100%",
    height: "10%",   //하단 공간
    alignItems: "center",
    backgroundColor: "green"
  },
  randommatching: {
    flex: 1,
    backgroundColor: '#E7D9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 3,
    borderColor: 'black',
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ff4c6f",
    alignItems: "center",
    justifyContent: "center",
  },
  img: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
  },
});