import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BarraNavegacao, type Aba } from "@/components/BarraNavegacao";
import { FilmeModal } from "@/components/FilmeModal";
import { ListaFilmes } from "@/components/ListaFilmes";
import { API_URL } from "@/constants/Api";
import { Colors } from "@/constants/Colors";
import type { Filme } from "@/types/Filme";

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
        <BarraNavegacao abaSelecionada={aba} onSelecionarAba={irParaAba} />
        <ListaFilmes
          filmes={filmes}
          aviso={aviso}
          listaRef={lista}
          onSelecionarFilme={(filme) => setFilmeAberto(filme)}
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
});
