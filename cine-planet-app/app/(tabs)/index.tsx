import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type Filme = {
  id: number;
  titulo: string;
  generos: string | null;
  duracao: string | null;
  sinopse: string | null;
  imagem: string | null;
  ano: number | null;
  diretor: string | null;
  classificacao: string | null;
};

type Aba = "Filmes" | "Sobre";

const API_HOST = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";
const API = `http://${API_HOST}:5292`;

export default function HomeScreen() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [aviso, setAviso] = useState("Carregando filmes...");
  const [filmeAberto, setFilmeAberto] = useState<Filme | null>(null);
  const [aba, setAba] = useState<Aba>("Filmes");
  const lista = useRef<FlatList<Filme>>(null);

  useEffect(() => {
    fetch(`${API}/api/filmes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`A API respondeu com o status ${response.status}.`);
        }
        return response.json() as Promise<Filme[]>;
      })
      .then((resultado) => {
        setFilmes(resultado);
        setAviso(
          resultado.length > 0
            ? ""
            : "Nenhum filme por aqui ainda.",
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

  const renderPoster = (filme: Filme, grande = false) => {
    const posterStyle = grande ? styles.posterGrande : styles.poster;
    if (filme.imagem) {
      return (
        <Image
          source={{ uri: `${API}${filme.imagem}` }}
          style={posterStyle}
          resizeMode="cover"
        />
      );
    }
    return (
      <View style={[posterStyle, styles.posterVazio]}>
        <Text style={styles.posterVazioTexto}>CINE{"\n"}PLANET</Text>
      </View>
    );
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
                <ActivityIndicator color={cores.ouro} />
              ) : null}
              <Text style={styles.aviso}>{aviso}</Text>
            </View>
          }
          renderItem={({ item: filme }) => (
            <Pressable
              accessibilityRole="button"
              onPress={() => setFilmeAberto(filme)}
              style={({ pressed }) => [
                styles.cartaoFilme,
                pressed && styles.cartaoPressionado,
              ]}
            >
              {renderPoster(filme)}
              <View style={styles.detalhesFilme}>
                <Text style={styles.nomeFilme} numberOfLines={2}>
                  {filme.titulo}
                </Text>
                <Text style={styles.textoCinza} numberOfLines={2}>
                  {filme.generos || "Gênero não informado"}
                </Text>
                <Text style={styles.duracao}>
                  {filme.duracao || "Duração não informada"}
                </Text>
              </View>
              <Text style={styles.seta}>›</Text>
            </Pressable>
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

        <Modal
          visible={filmeAberto !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setFilmeAberto(null)}
        >
          <ScrollView
            style={styles.fundoModal}
            contentContainerStyle={styles.conteudoModal}
          >
            {filmeAberto ? (
              <View style={styles.cartaoModal}>
                <View style={styles.cabecalhoModal}>
                  {renderPoster(filmeAberto, true)}
                  <View style={styles.detalhesModal}>
                    <Text style={styles.nomeFilme}>
                      {filmeAberto.titulo}
                    </Text>
                    <Text style={styles.textoCinza}>
                      {filmeAberto.generos || "Gênero não informado"}
                    </Text>
                    <Text style={styles.duracao}>
                      {filmeAberto.duracao || "Duração não informada"}
                    </Text>
                  </View>
                </View>

                {[
                  { nome: "ANO", valor: filmeAberto.ano },
                  { nome: "DIREÇÃO", valor: filmeAberto.diretor },
                  {
                    nome: "CLASSIFICAÇÃO",
                    valor: filmeAberto.classificacao,
                  },
                ].map(({ nome, valor }) => (
                  <Text key={nome} style={styles.metadado}>
                    <Text style={styles.rotuloMetadado}>{nome}  </Text>
                    {valor || "Não informado"}
                  </Text>
                ))}

                <Text style={styles.sinopse}>
                  {filmeAberto.sinopse || "Sinopse não informada."}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setFilmeAberto(null)}
                  style={styles.botaoFechar}
                >
                  <Text style={styles.textoBotaoFechar}>FECHAR</Text>
                </Pressable>
              </View>
            ) : null}
          </ScrollView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const cores = {
  fundo: "#0a0a0a",
  cartao: "#111111",
  borda: "#29251b",
  ouro: "#c9a84c",
  texto: "#f5f0e8",
  cinza: "#92908b",
};

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  navbar: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  marca: {
    color: cores.ouro,
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
    backgroundColor: "#2a2415",
  },
  textoAba: {
    color: "#cccccc",
    fontSize: 13,
    fontWeight: "700",
  },
  textoAbaAtiva: {
    color: cores.ouro,
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
    color: cores.ouro,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 9,
  },
  titulo: {
    color: cores.texto,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitulo: {
    color: cores.cinza,
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
    color: cores.texto,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  cartaoFilme: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 18,
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: "#222222",
  },
  cartaoPressionado: {
    borderColor: cores.ouro,
    opacity: 0.85,
  },
  poster: {
    width: 76,
    height: 104,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
  },
  posterGrande: {
    width: 112,
    height: 168,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
  },
  posterVazio: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: cores.borda,
  },
  posterVazioTexto: {
    color: cores.ouro,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
    lineHeight: 16,
  },
  detalhesFilme: {
    flex: 1,
    marginLeft: 14,
  },
  nomeFilme: {
    color: cores.texto,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  textoCinza: {
    color: cores.cinza,
    fontSize: 12,
  },
  duracao: {
    color: cores.ouro,
    fontSize: 12,
    marginTop: 8,
  },
  seta: {
    color: cores.ouro,
    fontSize: 25,
    marginLeft: 8,
    marginRight: 2,
  },
  sobre: {
    marginTop: 20,
    padding: 20,
    borderRadius: 18,
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: "#222222",
  },
  tituloSobre: {
    color: cores.texto,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  textoSobre: {
    color: cores.cinza,
    fontSize: 13,
    lineHeight: 21,
  },
  linhaSobre: {
    height: 1,
    backgroundColor: cores.borda,
    marginTop: 18,
    marginBottom: 14,
  },
  rodape: {
    color: cores.cinza,
    fontSize: 11,
  },
  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.82)",
  },
  conteudoModal: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 18,
  },
  cartaoModal: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: cores.borda,
  },
  cabecalhoModal: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  detalhesModal: {
    flex: 1,
    justifyContent: "center",
  },
  metadado: {
    color: "#cccccc",
    fontSize: 13,
    marginTop: 12,
  },
  rotuloMetadado: {
    color: cores.ouro,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  sinopse: {
    color: "#cccccc",
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
    color: cores.ouro,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
});