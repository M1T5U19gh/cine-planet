export type ClassificacaoEtaria = "L" | "10" | "12" | "14" | "16" | "18+";

export type Filme = {
  id: number;
  titulo: string;
  generos: string | null;
  duracao: string | null;
  sinopse: string | null;
  imagem: string | null;
  ano: number | null;
  diretor: string | null;
  classificacao: ClassificacaoEtaria;
};
