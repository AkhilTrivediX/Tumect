import predictTumorFromBase64 from "@/actions/predict";
import Button from "@/components/Button";
import ScanEffectImage from "@/components/ScanEffectImage";
import TumorReport from "@/components/TumorReport";
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
  safe: {
    background: '#071d08',
    foreground: '#e1ffd8',
    primary: '#5cff5c',
    primary_foreground: '#148a10'
  },
  unsafe: {
    background: '#1d1407',
    foreground: '#ffe8d8',
    primary: '#ff8a5c',
    primary_foreground: '#8a4710'
  }
}

export default function Index() {

  const appIcon = require("@/assets/images/icon.png")
  const previewImage = require("@/assets/images/demo1.jpg")

  const teamMembers = [
    'Akhil Trivedi',
    'Harshit Sharma',
    'Nikhil Srivastava',
    'Gaurav Singh'
  ]

  type PREDICTION_CLASSES = "default" | "safe" | "unsafe"

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [resultingClass, setResultingClass] = useState<string>("default");
  const [styleClass, setStyleClass] = useState<PREDICTION_CLASSES>("default");
  const [changeReady, setChangeReady] = useState(false);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      base64: true
    });

    if (!result.canceled) {
      setResultingClass("default");
      setSelectedImage(result.assets[0].uri);
      const base64Image = result.assets[0].base64;
      const b64Data = `data:image/jpeg;base64,${base64Image}`;
      const prediction = await predictTumorFromBase64(b64Data);
      console.log("Prediction:", prediction.class)
      setResultingClass(prediction.class);
    } else {
      alert('You did not select any image.');
    }
  };

  useEffect(()=>{
    if(resultingClass == "default" || !selectedImage) setChangeReady(false);
    else if(selectedImage){
      const timeout = setTimeout(()=>{
        setChangeReady(true);
      }, 2400)
      return ()=> clearTimeout(timeout);
    }
  },[resultingClass, selectedImage])

  useEffect(()=>{
    if(resultingClass=="default") setStyleClass("default");
    else if(resultingClass=="notumor") setStyleClass("safe");
    else setStyleClass("unsafe");
  },[resultingClass])

  const styles = useMemo(()=>{
       return StyleSheet.create({
      container: {
        backgroundColor: THEME[changeReady?styleClass:"default"].background,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        gap: 10,
        paddingVertical: 50
      },
      whiteText: {
        color: THEME[changeReady?styleClass:"default"].foreground
      },
      overlay: {
        position: "absolute",
        width: 256, height: 256,
        borderRadius: 15,
        backgroundColor: "rgba(0,0,0,0.8)",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        borderColor: THEME[changeReady?styleClass:"default"].primary+"65",
        borderWidth: 2,
      }
    })
  },[styleClass, changeReady])

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={{display: "flex", gap: 20, justifyContent: "center", width: "100%", flexDirection: "row"}}>
        <Image source={appIcon} style={{width: 50, height: 50, borderRadius: 10}}/>
        <Text style={{fontSize: 40, fontWeight: 800, ...styles.whiteText}}>Tumect</Text>
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
        <ScanEffectImage uri={selectedImage} currentClass={resultingClass}/>
      )}
      <Button label={`Select ${selectedImage ? 'another' : ''} Scan`} theme="primary" onPress={pickImageAsync} styleSheet={THEME[changeReady?styleClass:"default"]}/>
      {resultingClass!="default" && changeReady && <TumorReport condition={resultingClass} styleSheet={THEME[changeReady?styleClass:"default"]}/>}
      <Text style={{...styles.whiteText, fontSize: 14, marginTop: 40, fontFamily: 'monospace'}}>TEAM</Text>
      <Image source={appIcon} style={{width: 100, height: 100, borderRadius: 10}}/>
      <Text style={{...styles.whiteText, fontSize: 14, fontFamily: 'monospace'}}>NULL</Text>
      <View style={{ marginTop: 5, display: "flex", gap: 10 }}>
          {teamMembers.map((member, index) => (
              <Text
              key={index}
              style={{
                  color: THEME[changeReady?styleClass:"default"].foreground,
                  fontSize: 16,
                  marginRight: 8,
                  marginBottom: 4,
                  backgroundColor: '#3a3a3a33',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: THEME[changeReady?styleClass:"default"].primary+"99",
                  textAlign: 'center'
              }}
              >
              {member}
              </Text>
          ))}
      </View>
    </ScrollView>
  );
}

