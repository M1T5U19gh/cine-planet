import { Pressable, StyleSheet, Text, View } from "react-native";
import { getFilmeImageUrl } from "@/constants/Api";
import { Colors } from "@/constants/Colors";
import type { Filme } from "@/types/Filme";
import { PosterFilme } from "./PosterFilme";

type Props = {
  filme: Filme;
  onPress: () => void;
};

export function FilmeCard({ filme, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.cartao,
        pressed && styles.cartaoPressionado,
      ]}
    >
      <PosterFilme uri={getFilmeImageUrl(filme.imagem)} />
      <View style={styles.detalhes}>
        <Text style={styles.nome} numberOfLines={2}>
          {filme.titulo}
        </Text>
        <Text style={styles.textoCinza} numberOfLines={2}>
          {filme.generos || "Gênero não informado"}
        </Text>
        <Text style={styles.duracao}>
          {filme.duracao || "Duração não informada"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cartaoPressionado: {
    borderColor: Colors.accent,
    opacity: 0.85,
  },
  detalhes: {
    flex: 1,
    marginLeft: 14,
  },
  nome: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  textoCinza: {
    color: Colors.muted,
    fontSize: 12,
  },
  duracao: {
    color: Colors.accent,
    fontSize: 12,
    marginTop: 8,
  },
});
