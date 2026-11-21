using Dapper;
using MySqlConnector;

public static class FilmesController
{
    private static readonly string[] ClassificacoesPermitidas = ["L", "10", "12", "14", "16", "18+"];

    private static bool ClassificacaoPermitida(string classificacao)
    {
        return ClassificacoesPermitidas.Contains(classificacao, StringComparer.Ordinal);
    }

    private static IResult ErroClassificacao() =>
        Results.BadRequest(new { message = "A classificação deve ser L, 10, 12, 14, 16 ou 18+." });

    public static void Map(WebApplication app, string conexao, string site)
    {
        var uploads = Path.Combine(site, "assets", "images", "uploads");
        MySqlConnection Banco() => new(conexao);

        void ApagarFoto(string imagem)
        {
            if (imagem?.StartsWith("/assets/images/uploads/") == true)
                File.Delete(Path.Combine(uploads, Path.GetFileName(imagem)));
        }

        var filmes = app.MapGroup("/api/filmes");

        filmes.MapGet("/", async () =>
        {
            await using var db = Banco();
            return await db.QueryAsync<Filme>("select * from filmes order by titulo");
        });

        filmes.MapGet("/{id:int}", async (int id) =>
        {
            await using var db = Banco();
            var filme = await db.QuerySingleOrDefaultAsync<Filme>(
                "select * from filmes where id = @id", new { id });
            return filme is null
                ? Results.NotFound(new { message = "Filme não encontrado." })
                : Results.Ok(filme);
        });

        async Task<IResult> Criar(Filme filme)
        {
            if (!ClassificacaoPermitida(filme.Classificacao)) return ErroClassificacao();

            await using var db = Banco();
            await db.OpenAsync();
            await db.ExecuteAsync(@"insert into filmes (titulo, generos, duracao, sinopse, imagem, ano, diretor, classificacao)
                                    values (@Titulo, @Generos, @Duracao, @Sinopse, @Imagem, @Ano, @Diretor, @Classificacao)", filme);
            var id = await db.ExecuteScalarAsync<int>("select last_insert_id()");
            return Results.Created($"/api/filmes/{id}", new { id });
        }

        filmes.MapPost("/", Criar);

        async Task<IResult> Atualizar(int id, Filme filme)
        {
            if (!ClassificacaoPermitida(filme.Classificacao)) return ErroClassificacao();

            filme.Id = id;
            await using var db = Banco();
            var fotoAntiga = await db.ExecuteScalarAsync<string>(
                "select imagem from filmes where id = @id", new { id });
            var alterados = await db.ExecuteAsync(@"update filmes set titulo = @Titulo, generos = @Generos, duracao = @Duracao, sinopse = @Sinopse,
                                                    imagem = @Imagem, ano = @Ano, diretor = @Diretor, classificacao = @Classificacao where id = @Id", filme);
            if (alterados == 0) return Results.NotFound(new { message = "Filme não encontrado." });
            if (fotoAntiga != filme.Imagem) ApagarFoto(fotoAntiga);
            return Results.Ok();
        }

        filmes.MapPost("/{id:int}", Atualizar);
        filmes.MapPut("/{id:int}", Atualizar);

        filmes.MapDelete("/{id:int}", async (int id) =>
        {
            await using var db = Banco();
            var foto = await db.ExecuteScalarAsync<string>(
                "select imagem from filmes where id = @id", new { id });
            var removidos = await db.ExecuteAsync("delete from filmes where id = @id", new { id });
            if (removidos == 0) return Results.NotFound(new { message = "Filme não encontrado." });
            ApagarFoto(foto);
            return Results.NoContent();
        });

        filmes.MapPost("/upload", async (HttpRequest req) =>
        {
            var formulario = await req.ReadFormAsync();
            if (formulario.Files.Count == 0)
                return Results.BadRequest(new { message = "Selecione uma imagem para enviar." });

            var arquivo = formulario.Files[0];
            var extensao = Path.GetExtension(arquivo.FileName).ToLower();
            if (!new[] { ".jpg", ".jpeg", ".png", ".webp" }.Contains(extensao))
                return Results.BadRequest(new { message = "Envie uma imagem JPG, PNG ou WebP." });

            Directory.CreateDirectory(uploads);
            var nome = Guid.NewGuid().ToString("N") + extensao;
            using (var saida = File.Create(Path.Combine(uploads, nome)))
                await arquivo.CopyToAsync(saida);
            return Results.Ok(new { imagem = "/assets/images/uploads/" + nome });
        });
    }
}
