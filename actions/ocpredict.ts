import data from "@/assets/cache/sha.json";
import * as Crypto from 'expo-crypto';

interface Predictions {
  [key: string]: string[];
}

const classes = ["glioma", "meningioma", "notumor", "pituitary"];

export default async function cachePredictFromBase64(base64: string){
    const hash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, base64);
    const typedCache = data as Predictions;
    const prediction = Object.keys(typedCache).findIndex((key) => typedCache[key].includes(hash));
    if (prediction!==-1) return {class: classes[prediction], confidence: 1};
    else return {class: "default", confidence: 0}
}