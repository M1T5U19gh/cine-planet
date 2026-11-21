import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

export type Aba = "Filmes" | "Sobre";

type Props = {
  abaSelecionada: Aba;
  onSelecionarAba: (aba: Aba) => void;
};

export function BarraNavegacao({
  abaSelecionada,
  onSelecionarAba,
}: Props) {
  return (
    <View style={styles.navbar}>
      <Text style={styles.marca}>CINE-PLANET</Text>
      <View style={styles.abas}>
        {(["Filmes", "Sobre"] as const).map((nome) => (
          <Pressable
            key={nome}
            accessibilityRole="button"
            onPress={() => onSelecionarAba(nome)}
            style={[
              styles.botaoAba,
              abaSelecionada === nome && styles.abaAtiva,
            ]}
          >
            <Text
              style={[
                styles.textoAba,
                abaSelecionada === nome && styles.textoAbaAtiva,
              ]}
            >
              {nome}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
