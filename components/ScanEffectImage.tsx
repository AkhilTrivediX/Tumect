import { Canvas, Image, RuntimeShader, Skia, useImage } from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

const colors = {
  initial: "25, 115, 255",
  safe: "99, 255, 110",
  unsafe: "255, 163, 25",
}

export default function ScanEffectImage({uri, currentClass}: {uri: string, currentClass?: string}) {
  const image = useImage(uri);
  const duration = 3000;
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [restartAnimation, setRestartAnimation] = useState(0);

  const shader = useMemo(() => Skia.RuntimeEffect.Make(`
uniform shader image;
uniform float progress;

half4 main(float2 xy) {
    half4 color = image.eval(xy).rgba;
    float lum = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    half3 gray = half3(lum);

    float canvasHeight = 256.0;
    float waveHeight = 80.0;               
    half3 scanColor = half3(${currentClass == "default" || !cycleCount ? colors.initial : (currentClass == "notumor"? colors.safe : colors.unsafe)})/255; 

    float waveTravel = canvasHeight + waveHeight;

    float totalDuration = 3.0;
    float maxDelaySec = 0.5;
    float delay = lum * maxDelaySec;
    float delayProgress = delay / totalDuration;

    float localProgress = clamp(progress - delayProgress, 0.0, 1.0);

    float topY = localProgress * waveTravel - waveHeight;
    float bottomY = topY + waveHeight;

    float mask = 0.0;
    if(xy.y >= topY && xy.y <= bottomY){
        float d = xy.y - topY;
        mask = clamp(d / waveHeight, 0.0, 1.0);
        mask = pow(mask, 1.2);
    }

    half3 outColor = mix(gray, scanColor, mask);

    return half4(outColor, color.a);
}
  `)!, [currentClass, cycleCount]);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    let lastCount = 1;

    const loop = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      setProgress((elapsed % duration) / duration);
      if(elapsed > lastCount*duration){
        setCycleCount(prev=>prev+1);
        lastCount++;
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [restartAnimation]);

  useEffect(()=>{
    if(currentClass == "default"){
      setCycleCount(0);
      setRestartAnimation(prev=>prev+1);
    }
  },[currentClass])

  return (
    <View style={{ width: 256, height: 256, borderRadius: 15, borderWidth: 2, borderColor: `rgba(${currentClass=="default" || !cycleCount ? colors.initial : (currentClass == "notumor"? colors.safe : colors.unsafe)})`, overflow: 'hidden' }}>
      <Canvas style={{ flex: 1, borderRadius: 15  }}>
        {image && (
          <Image image={image} x={0} y={0} width={256} height={256} fit="cover">
            <RuntimeShader source={shader} uniforms={{ progress: cycleCount<2 || currentClass == "default"?progress:0 }} />
          </Image>
        )}
      </Canvas>
    </View>
  );
}
