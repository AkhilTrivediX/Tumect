import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  theme?: 'primary';
  onPress?: () => void;
  styleSheet?: {
      background: string,
      foreground: string,
      primary: string,
      primary_foreground: string
   }
};

export default function Button({ label, theme, onPress, styleSheet }: Props) {
  if (theme === 'primary') {
    return (
      <View
        style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: styleSheet?.primary || '#5cb0ff', borderRadius: 18 },
        ]}>
        <Pressable style={[styles.button, { backgroundColor: styleSheet?.primary || '#5cb0ff' }]} onPress={onPress}>
          <FontAwesome name="picture-o" size={18} color={styleSheet?.primary_foreground || "#104f8a"} style={styles.buttonIcon} />
          <Text style={[styles.buttonLabel, { color: styleSheet?.primary_foreground || '#104f8a', fontWeight: 600 }]}>{label}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={() => alert('You pressed a button.')}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});
