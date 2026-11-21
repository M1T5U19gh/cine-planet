import type { Ref } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FilmeCard } from "@/components/FilmeCard";
import { Colors } from "@/constants/Colors";
import type { Filme } from "@/types/Filme";

type Props = {
  filmes: Filme[];
  aviso: string;
  listaRef: Ref<FlatList<Filme>>;
  onSelecionarFilme: (filme: Filme) => void;
};

export function ListaFilmes({
  filmes,
  aviso,
  listaRef,
  onSelecionarFilme,
}: Props) {
  return (
    <FlatList
      ref={listaRef}
      data={filmes}
      keyExtractor={(filme) => String(filme.id)}
      contentContainerStyle={styles.conteudo}
      ListHeaderComponent={
        <View style={styles.cabecalho}>
          <Text style={styles.sobretitulo}>DESCUBRA SEU PRÓXIMO FILME</Text>
          <Text style={styles.titulo}>Cine-Planet</Text>
          <Text style={styles.subtitulo}>
            Histórias para assistir, mundos para explorar.
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.estadoVazio}>
          {aviso === "Carregando filmes..." ? (
            <ActivityIndicator color={Colors.accent} />
          ) : null}
          <Text style={styles.aviso}>{aviso}</Text>
        </View>
      }
      renderItem={({ item }) => (
        <FilmeCard
          filme={item}
          onPress={() => onSelecionarFilme(item)}
        />
      )}
      ListFooterComponent={
        <View style={styles.sobre}>
          <Text style={styles.sobretitulo}>SOBRE</Text>
          <Text style={styles.tituloSobre}>Cine-Planet</Text>
          <Text style={styles.textoSobre}>
            Um espaço simples para descobrir filmes e escolher o que assistir a
            seguir.
          </Text>
          <View style={styles.linhaSobre} />
          <Text style={styles.rodape}>
            © 2026 Cine-Planet · Poá, São Paulo
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    gap: 12,
  },
  cabecalho: {
    marginBottom: 12,
  },
  sobretitulo: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 9,
  },
  titulo: {
    color: Colors.text,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitulo: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
  estadoVazio: {
    minHeight: 160,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  aviso: {
    color: Colors.text,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  sobre: {
    marginTop: 20,
    padding: 20,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  tituloSobre: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  textoSobre: {
    color: Colors.muted,
    fontSize: 13,
    lineHeight: 21,
  },
  linhaSobre: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 18,
    marginBottom: 14,
  },
  rodape: {
    color: Colors.muted,
    fontSize: 11,
  },
});
