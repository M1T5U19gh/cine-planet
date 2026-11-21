using Dapper;
using MySqlConnector;

public static class FilmesController
{
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
            await Banco().QueryAsync<Filme>("select * from filmes order by titulo"));

        filmes.MapGet("/{id:int}", async (int id) =>
            await Banco().QuerySingleOrDefaultAsync<Filme>(
                "select * from filmes where id = @id", new { id }) is { } filme
                    ? Results.Ok(filme)
                    : Results.NotFound(new { message = "Filme não encontrado." }));

        filmes.MapPost("/", async (Filme filme) =>
        {
            await Banco().ExecuteAsync(@"insert into filmes (titulo, generos, duracao, sinopse, imagem, ano, diretor, classificacao)
                                         values (@Titulo, @Generos, @Duracao, @Sinopse, @Imagem, @Ano, @Diretor, @Classificacao)", filme);
            return Results.Ok();
        });

        filmes.MapPut("/{id:int}", async (int id, Filme filme) =>
        {
            filme.Id = id;
            var db = Banco();
            var fotoAntiga = await db.ExecuteScalarAsync<string>(
                "select imagem from filmes where id = @id", new { id });
            var alterados = await db.ExecuteAsync(@"update filmes set titulo = @Titulo, generos = @Generos, duracao = @Duracao, sinopse = @Sinopse,
                                                    imagem = @Imagem, ano = @Ano, diretor = @Diretor, classificacao = @Classificacao where id = @Id", filme);
            if (alterados == 0) return Results.NotFound(new { message = "Filme não encontrado." });
            if (fotoAntiga != filme.Imagem) ApagarFoto(fotoAntiga);
            return Results.Ok();
        });

        filmes.MapDelete("/{id:int}", async (int id) =>
        {
            var db = Banco();
            var foto = await db.ExecuteScalarAsync<string>(
                "select imagem from filmes where id = @id", new { id });
            await db.ExecuteAsync("delete from filmes where id = @id", new { id });
            ApagarFoto(foto);
            return Results.NoContent();
        });

        filmes.MapPost("/upload", async (HttpRequest req) =>
        {
            var arquivo = (await req.ReadFormAsync()).Files[0];
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
