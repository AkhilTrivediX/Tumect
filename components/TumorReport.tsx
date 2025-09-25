import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

const tumorInfo: Record<string, { name: string; description: string; commonSymptoms: string[]; treatmentOverview: string }> = {
  glioma: {
    name: "Glioma",
    description: "A tumor in the glial cells of the brain or spine.",
    commonSymptoms: [
      "Headaches",
      "Seizures",
      "Nausea or vomiting",
      "Cognitive or speech difficulties"
    ],
    treatmentOverview: "Surgery, radiation therapy, and chemotherapy."
  },
  meningioma: {
    name: "Meningioma",
    description: "Tumor forming on the meninges, usually benign.",
    commonSymptoms: [
      "Headaches",
      "Vision problems",
      "Hearing loss",
      "Weakness in limbs"
    ],
    treatmentOverview: "Often removed surgically; sometimes radiation therapy is used."
  },
  pituitary: {
    name: "Pituitary Tumor",
    description: "Tumor in the pituitary gland affecting hormone levels.",
    commonSymptoms: [
      "Hormonal imbalances",
      "Vision problems",
      "Fatigue",
      "Unexplained weight changes"
    ],
    treatmentOverview: "Medication, surgery, or radiation."
  },
  notumor: {
    name: "No Tumor Detected",
    description: "No abnormal growth detected in the scanned image.",
    commonSymptoms: [],
    treatmentOverview: "No treatment required."
  }
};


export default function TumorReport({condition, styleSheet}: {condition: string, styleSheet?: {background: string, foreground: string, primary: string, primary_foreground: string}}) {
    const styles = useMemo(()=>{
        return StyleSheet.create({
                container:{
                    display: "flex",
                    width: "100%",
                    paddingVertical: 10,
                    paddingHorizontal: 30
                },
                subHeading: {
                fontSize: 14,
                color: styleSheet?.foreground || '#d8ecff',
                fontFamily: 'monospace',
                },
                divider: {
                    width: "100%",
                    height: 1,
                    backgroundColor: styleSheet?.foreground || '#d8ecff',
                    marginVertical: 10,
                    
                }
            })
    },[styleSheet])
   
    return(
        <View style={styles.container}>
            <Text style={styles.subHeading}>Tumor Type</Text>
            <Text style={{
                fontSize: 30,
                fontWeight: 800,
                color: styleSheet?.primary || '#5cb0ff',
            }}>{tumorInfo[condition].name}</Text>
            <Text style={{
                fontSize: 16,
                color: styleSheet?.foreground || '#d8ecff',

            }}>{tumorInfo[condition].description}</Text>
            {condition != "notumor" && (
              <>
              <View style={styles.divider}/>
                <Text style={styles.subHeading}>Symptoms</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                    {tumorInfo[condition].commonSymptoms.map((symptom, index) => (
                        <Text
                        key={index}
                        style={{
                            color: styleSheet?.foreground || '#d8ecff',
                            fontSize: 16,
                            marginRight: 8,
                            marginBottom: 4,
                            backgroundColor: '#3a3a3a33',
                            paddingHorizontal: 6,
                            paddingVertical: 2,
                            borderRadius: 4,
                            borderWidth: 1,
                            borderColor: (styleSheet?.primary || '#5cb0ff')+'99'
                        }}
                        >
                        {symptom}
                        </Text>
                    ))}
                </View>
                <View style={styles.divider}/>
                <Text style={styles.subHeading}>Treatment</Text>
                <Text style={{
                    fontSize: 16,
                    color: styleSheet?.foreground || '#d8ecff',
                }}>{tumorInfo[condition].treatmentOverview}</Text>
              </>
            )}
        </View>
    )
}

