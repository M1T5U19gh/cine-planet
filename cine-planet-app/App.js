import { useEffect, useRef, useState } from "react"
import { registerRootComponent } from "expo"
import { StatusBar } from "expo-status-bar"
import Constants from "expo-constants"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { FlatList, Image, Modal, Pressable, ScrollView, Text, View } from "react-native"

// usa o IP do computador que está rodando o Expo (a API roda na porta 5292)
const API = `http://${Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost"}:5292`

function App() {
  const [filmes, setFilmes] = useState([])
  const [aviso, setAviso] = useState("Carregando filmes...")
  const [aberto, setAberto] = useState(null)
  const [aba, setAba] = useState("Filmes")
  const lista = useRef()

  useEffect(() => {
    fetch(API + "/api/filmes").then(r => r.ok ? r.json() : Promise.reject()).then(lista => {
      setFilmes(lista)
      setAviso(lista.length ? "" : "Nenhum filme por aqui ainda.")
    })
      .catch(() => setAviso("Não foi possível conectar à API."))
  }, [])

  const ir = nome => {
    setAba(nome)
    nome == "Filmes" ? lista.current.scrollToOffset({ offset: 0 }) : lista.current.scrollToEnd()
  }
  const poster = (f, estilo) => <Image source={f.imagem ? { uri: API + f.imagem } : undefined} style={estilo} />

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
        <StatusBar style="light" />

        <View style={s.navbar}>
          {["Filmes", "Sobre"].map(nome => (
            <Pressable key={nome} onPress={() => ir(nome)} style={[s.botao, aba == nome && { backgroundColor: "#2a2415" }]}>
              <Text style={{ color: aba == nome ? "#c9a84c" : "#ccc", fontWeight: "700" }}>{nome}</Text>
            </Pressable>
          ))}
        </View>

        <FlatList
          ref={lista}
          data={filmes}
          keyExtractor={f => String(f.id)}
          contentContainerStyle={{ padding: 20, gap: 12 }}
          ListHeaderComponent={<Text style={s.titulo}>Cine-Planet</Text>}
          ListEmptyComponent={<Text style={s.aviso}>{aviso}</Text>}
          renderItem={({ item: f }) => (
            <Pressable onPress={() => setAberto(f)} style={s.filme}>
              {poster(f, s.poster)}
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={s.nome} numberOfLines={2}>{f.titulo}</Text>
                <Text style={s.cinza}>{f.generos}</Text>
                <Text style={s.duracao}>{f.duracao}</Text>
              </View>
            </Pressable>
          )}
          ListFooterComponent={
            <View style={[s.filme, { flexDirection: "column", alignItems: "flex-start", marginTop: 24 }]}>
              <Text style={s.ouro}>SOBRE</Text>
              <Text style={s.nome}>Cine-Planet</Text>
              <Text style={[s.cinza, { fontSize: 13, lineHeight: 21 }]}>
                Um espaço simples para descobrir filmes e escolher o que assistir a seguir.
              </Text>
              <Text style={[s.cinza, { marginTop: 16 }]}>© 2026 Cine-Planet · Poá, São Paulo</Text>
            </View>
          }
        />

        <Modal visible={!!aberto} transparent animationType="fade" onRequestClose={() => setAberto(null)}>
          <ScrollView style={{ backgroundColor: "#000c" }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 18 }}>
            {aberto && (
              <View style={[s.filme, { flexDirection: "column", alignItems: "stretch", padding: 20 }]}>
                <View style={{ flexDirection: "row", gap: 16 }}>
                  {poster(aberto, { ...s.poster, width: 112, height: 168 })}
                  <View style={{ flex: 1 }}>
                    <Text style={s.nome}>{aberto.titulo}</Text>
                    <Text style={s.cinza}>{aberto.generos}</Text>
                    <Text style={s.duracao}>{aberto.duracao}</Text>
                  </View>
                </View>

                {[["ANO", aberto.ano], ["DIREÇÃO", aberto.diretor], ["CLASSIFICAÇÃO", aberto.classificacao]].map(([nome, valor]) => (
                  <Text key={nome} style={{ color: "#ccc", marginTop: 12 }}><Text style={s.ouro}>{nome}  </Text>{valor || "Não informado"}</Text>
                ))}

                <Text style={{ color: "#ccc", lineHeight: 22, marginVertical: 18 }}>{aberto.sinopse}</Text>
                <Pressable onPress={() => setAberto(null)}><Text style={[s.ouro, { textAlign: "right" }]}>FECHAR</Text></Pressable>
              </View>
            )}
          </ScrollView>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const s = {
  navbar: { flexDirection: "row", padding: 10, paddingHorizontal: 20, borderBottomWidth: 1, borderColor: "#2a2415" },
  botao: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 10, marginRight: 8 },
  titulo: { color: "#f5f0e8", fontSize: 28, fontWeight: "800", marginBottom: 12 },
  aviso: { color: "#f5f0e8", textAlign: "center", padding: 40 },
  filme: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 18, backgroundColor: "#111", borderWidth: 1, borderColor: "#222" },
  poster: { width: 76, height: 104, borderRadius: 10, backgroundColor: "#1a1a1a" },
  nome: { color: "#f5f0e8", fontSize: 17, fontWeight: "700", marginBottom: 6 },
  cinza: { color: "#888", fontSize: 12 },
  duracao: { color: "#c9a84c", fontSize: 12, marginTop: 8 },
  ouro: { color: "#c9a84c", fontSize: 11, fontWeight: "800", letterSpacing: 1.5 },
}

registerRootComponent(App)
