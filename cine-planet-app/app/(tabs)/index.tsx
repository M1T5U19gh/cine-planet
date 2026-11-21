import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FilmeCard } from "@/components/FilmeCard";
import { FilmeModal } from "@/components/FilmeModal";
import { API_URL } from "@/constants/Api";
import { Colors } from "@/constants/Colors";
import type { Filme } from "@/types/Filme";

type Aba = "Filmes" | "Sobre";

export default function HomeScreen() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [aviso, setAviso] = useState("Carregando filmes...");
  const [filmeAberto, setFilmeAberto] = useState<Filme | null>(null);
  const [aba, setAba] = useState<Aba>("Filmes");
  const lista = useRef<FlatList<Filme>>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/filmes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`A API respondeu com o status ${response.status}.`);
        }
        return response.json() as Promise<Filme[]>;
      })
      .then((resultado) => {
        setFilmes(resultado);
        setAviso(
          resultado.length > 0 ? "" : "Nenhum filme por aqui ainda.",
        );
      })
      .catch((error: unknown) => {
        console.error("Não foi possível carregar os filmes.", error);
        setAviso("Não foi possível conectar à API.");
      });
  }, []);

  const irParaAba = (nome: Aba) => {
    setAba(nome);
    if (nome === "Filmes") {
      lista.current?.scrollToOffset({ offset: 0, animated: true });
    } else {
      lista.current?.scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.tela} edges={["top", "bottom"]}>
        <StatusBar style="light" />

        <View style={styles.navbar}>
          <Text style={styles.marca}>CINE-PLANET</Text>
          <View style={styles.abas}>
            {(["Filmes", "Sobre"] as const).map((nome) => (
              <Pressable
                key={nome}
                accessibilityRole="button"
                onPress={() => irParaAba(nome)}
                style={[styles.botaoAba, aba === nome && styles.abaAtiva]}
              >
                <Text
                  style={[
                    styles.textoAba,
                    aba === nome && styles.textoAbaAtiva,
                  ]}
                >
                  {nome}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <FlatList
          ref={lista}
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
          renderItem={({ item: filme }) => (
            <FilmeCard
              filme={filme}
              onPress={() => setFilmeAberto(filme)}
            />
          )}
          ListFooterComponent={
            <View style={styles.sobre}>
              <Text style={styles.sobretitulo}>SOBRE</Text>
              <Text style={styles.tituloSobre}>Cine-Planet</Text>
              <Text style={styles.textoSobre}>
                Um espaço simples para descobrir filmes e escolher o que
                assistir a seguir.
              </Text>
              <View style={styles.linhaSobre} />
              <Text style={styles.rodape}>
                © 2026 Cine-Planet · Poá, São Paulo
              </Text>
            </View>
          }
        />

        <FilmeModal
          filme={filmeAberto}
          onClose={() => setFilmeAberto(null)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navbar: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  marca: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
  },
  abas: {
    flexDirection: "row",
    gap: 8,
  },
  botaoAba: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  abaAtiva: {
    backgroundColor: Colors.activeTab,
  },
  textoAba: {
    color: Colors.secondaryText,
    fontSize: 13,
    fontWeight: "700",
  },
  textoAbaAtiva: {
    color: Colors.accent,
  },
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
