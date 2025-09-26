import cachePredictFromBase64 from "@/actions/ocpredict";
import predictTumorFromBase64 from "@/actions/predict";
import Button from "@/components/Button";
import ScanEffectImage from "@/components/ScanEffectImage";
import TumorReport from "@/components/TumorReport";
import NetInfo from "@react-native-community/netinfo";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export const THEME = {
  default: {
    background: '#07121d',
    foreground: '#d8ecff',
    primary: '#5cb0ff',
    primary_foreground: '#104f8a'
  },
  notumor: {
    background: '#071d08',
    foreground: '#e1ffd8',
    primary: '#5cff5c',
    primary_foreground: '#148a10'
  },
  meningioma: {
    background: '#1d1a07',
    foreground: '#fffbd8',
    primary: '#fcff5c',
    primary_foreground: '#8a7810'
  },
  pituitary: {
    background: '#1d1407',
    foreground: '#ffe8d8',
    primary: '#ff8a5c',
    primary_foreground: '#8a4710'
  },
  glioma: {
    background: '#1d0707',
    foreground: '#ffd8d8',
    primary: '#ff5c5c',
    primary_foreground: '#8a1010'
  },
}

export default function Index() {

  const appIcon = require("@/assets/images/Tumect Logo.png")
  const previewImage = require("@/assets/images/demo1.jpg")
  const teamLogo = require("@/assets/images/Null.png")

  const teamMembers = [
    'Akhil Trivedi',
    'Harshit Sharma',
    'Nikhil Srivastava',
    'Gaurav Singh'
  ]

  const teamImages: Record<string, any> = {
    "Akhil Trivedi": require("@/assets/images/akhil_portrait.png"),
    "Harshit Sharma": require("@/assets/images/harshit_portrait.png"),
  }

  const teamFrontImages: Record<string, any> = {
    "Akhil Trivedi": require("@/assets/images/akhil_portrait_front.png"),
    "Harshit Sharma": require("@/assets/images/harshit_portrait_front.png"),
  }

  type PREDICTION_CLASSES = "default" | "notumor" | "meningioma" | "pituitary" | "glioma";

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [resultingClass, setResultingClass] = useState<PREDICTION_CLASSES>("default");
  const [changeReady, setChangeReady] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [lowConfidence, setLowConfidence] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      base64: true
    });

    if (!result.canceled) {
      setResultingClass("default");
      setLowConfidence(false)
      setSelectedImage(result.assets[0].uri);
      const base64Image = result.assets[0].base64;
      let prediction;
      if(isConnected)
      {
        const b64Data = `data:image/jpeg;base64,${base64Image}`;
        prediction = await predictTumorFromBase64(b64Data);
        setConfidence(prediction.confidence);
      }
      else{
        prediction = await cachePredictFromBase64(base64Image as string);
        if(prediction.confidence<50) setLowConfidence(true);
        else setConfidence(prediction.confidence);
      }
      setResultingClass(prediction.class as PREDICTION_CLASSES);
    } else {
      alert('You did not select any image.');
    }
  };

  useEffect(()=>{
    setChangeReady(false);
    const timeout = setTimeout(()=>{
      setChangeReady(true);
    }, 3000)
    return ()=> clearTimeout(timeout);
  },[selectedImage])



  const styles = useMemo(()=>{
       return StyleSheet.create({
      container: {
        backgroundColor: THEME[changeReady?resultingClass:"default"].background,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        gap: 10,
        paddingVertical: 50
      },
      whiteText: {
        color: THEME[changeReady?resultingClass:"default"].foreground
      },
      overlay: {
        position: "absolute",
        width: 256, height: 256,
        borderRadius: 15,
        backgroundColor: "rgba(0,0,0,0.8)",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        borderColor: THEME[changeReady?resultingClass:"default"].primary+"65",
        borderWidth: 2,
      },
      colorOverlay: {
                  position: "absolute",
                  top: -20, left: 0, right: 0, bottom:0,
                  backgroundColor: THEME[changeReady?resultingClass:"default"].primary,
                  mixBlendMode: "hue",
                  zIndex:2
                }
    })
  },[resultingClass, changeReady])

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={{display: "flex", gap: 20, justifyContent: "center", width: "100%", flexDirection: "row"}}>
        <Image source={appIcon} style={{width: 50, height: 50, borderRadius: 10}}/>
        <Text style={{fontSize: 40, fontWeight: 800, ...styles.whiteText}}>Tumect</Text>
        <View style={styles.colorOverlay}/>
      </View>
      <Text style={{...styles.whiteText}}>Select a MRI Scan to detect any kind of tumors.</Text>
      {!selectedImage ? (
        <View style={{position: "relative"}}>
        <Image source={previewImage} style={{width: 256, height: 256, borderRadius: 15}}/>
        <View style={styles.overlay}>
          <Text style={{...styles.whiteText, fontSize: 16, fontWeight: 600}}>Please Select A Scan</Text>
        </View>
      </View>
      ): (
        <ScanEffectImage key={selectedImage} uri={selectedImage} currentClass={resultingClass}/>
      )}
      <Button label={`Select ${selectedImage ? 'another' : ''} Scan`} theme="primary" onPress={pickImageAsync} styleSheet={THEME[changeReady?resultingClass:"default"]}/>
      {resultingClass!="default" && changeReady && <TumorReport condition={resultingClass} confidence={confidence} styleSheet={THEME[changeReady?resultingClass:"default"]}/>}
      {lowConfidence && changeReady && <Text style={{...styles.whiteText, fontFamily: "monospace", paddingHorizontal: 20, textAlign: "justify"}}>
          Low Confidence Prediction... Kindly connect to the internet for results from remote model.
        </Text>}
      <Text style={{...styles.whiteText, fontSize: 14, marginTop: 40, fontFamily: 'monospace'}}>TEAM</Text>
      <View>
        <Image source={teamLogo} style={{width: 75, height: 75, borderRadius: 10}}></Image>
        <View style={styles.colorOverlay}/>
      </View>
      
      <Text style={{...styles.whiteText, fontSize: 14, fontFamily: 'monospace'}}>NULL</Text>
      <View style={{ marginTop: 5, display: "flex", gap: 10, position: "relative" }}>
          {teamMembers.map((member, index) => (
              <View key={index}
                    style={{
                        marginRight: 8,
                        marginBottom: 4,
                        backgroundColor: '#3a3a3a33',
                        paddingHorizontal: 6,
                        paddingLeft: teamImages[member]? 35 : 6,
                        paddingVertical: 2,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: THEME[changeReady?resultingClass:"default"].primary+"99",
                        alignSelf: "center"
                    }}>
                <Text
                    style={{
                        color: THEME[changeReady?resultingClass:"default"].foreground,
                        fontSize: 16,
                        textAlign: 'right'
                    }}
                    >
                    {member}
                  </Text>
                {teamImages[member] && <Image source={teamImages[member]} style={{
                  width: 30, height: 30, position:"absolute", bottom: 0, left: 0, borderBottomLeftRadius: 8, zIndex: 1}}/>}
                <View style={styles.colorOverlay}/>
                {teamFrontImages[member] && <Image source={teamFrontImages[member]} style={{
                  width: 30, height: 30, position:"absolute", bottom: 0, left: 0, borderBottomLeftRadius: 8, zIndex: 3}}/>}
              </View>
          ))}
      </View>
    </ScrollView>
  );
}

