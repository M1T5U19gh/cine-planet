import { Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

type Props = {
  uri: string | null;
  grande?: boolean;
};

export function PosterFilme({ uri, grande = false }: Props) {
  const posterStyle = grande ? styles.grande : styles.normal;

  if (uri) {
    return <Image source={{ uri }} style={posterStyle} resizeMode="cover" />;
  }

  return (
    <View style={[posterStyle, styles.vazio]}>
      <Text style={styles.textoVazio}>CINE{"\n"}PLANET</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  normal: {
    width: 76,
    height: 104,
    borderRadius: 10,
    backgroundColor: Colors.posterBackground,
  },
  grande: {
    width: 112,
    height: 168,
    borderRadius: 12,
    backgroundColor: Colors.posterBackground,
  },
  vazio: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textoVazio: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 16,
  },
});
