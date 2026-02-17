import { View, Text, Pressable } from 'react-native';
import styles from './styles';

interface BackHanderProps {
  onPress: () => void;
}

export default function BackHander({ onPress }: BackHanderProps) {
  return (
    <View style={styles.backHandlerConatiner}>
      <Pressable onPress={onPress}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
    </View>
  );
}
