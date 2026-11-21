import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getFilmeImageUrl } from "@/constants/Api";
import { Colors } from "@/constants/Colors";
import type { Filme } from "@/types/Filme";
import { PosterFilme } from "./PosterFilme";

type Props = {
  filme: Filme | null;
  onClose: () => void;
};

export function FilmeModal({ filme, onClose }: Props) {
  return (
    <Modal
      visible={filme !== null}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ScrollView
        style={styles.fundo}
        contentContainerStyle={styles.conteudo}
      >
        {filme ? (
          <View style={styles.cartao}>
            <View style={styles.cabecalho}>
              <PosterFilme uri={getFilmeImageUrl(filme.imagem)} grande />
              <View style={styles.detalhes}>
                <Text style={styles.nome}>{filme.titulo}</Text>
                <Text style={styles.textoCinza}>
                  {filme.generos || "Gênero não informado"}
                </Text>
                <Text style={styles.duracao}>
                  {filme.duracao || "Duração não informada"}
                </Text>
              </View>
            </View>

            {[
              { nome: "ANO", valor: filme.ano },
              { nome: "DIREÇÃO", valor: filme.diretor },
              { nome: "CLASSIFICAÇÃO", valor: filme.classificacao },
            ].map(({ nome, valor }) => (
              <Text key={nome} style={styles.metadado}>
                <Text style={styles.rotulo}>{nome}  </Text>
                {valor || "Não informado"}
              </Text>
            ))}

            <Text style={styles.sinopse}>
              {filme.sinopse || "Sinopse não informada."}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={styles.botaoFechar}
            >
              <Text style={styles.textoBotaoFechar}>FECHAR</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: Colors.modalOverlay,
  },
  conteudo: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 18,
  },
  cartao: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cabecalho: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  detalhes: {
    flex: 1,
    justifyContent: "center",
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
  metadado: {
    color: Colors.secondaryText,
    fontSize: 13,
    marginTop: 12,
  },
  rotulo: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  sinopse: {
    color: Colors.secondaryText,
    fontSize: 14,
    lineHeight: 22,
    marginVertical: 20,
  },
  botaoFechar: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingLeft: 16,
  },
  textoBotaoFechar: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
});
