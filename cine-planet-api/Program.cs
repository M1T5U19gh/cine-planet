using Microsoft.Extensions.FileProviders;

// Execute `dotnet run` nesta pasta; o site e o dashboard ficam nas pastas irmãs.
var site = Path.GetFullPath("../cine-planet-site");

var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = args, WebRootPath = site });
//builder.WebHost.UseUrls("http://0.0.0.0:5292"); //escolhe o localhost
builder.Services.AddCors();
var conexao = builder.Configuration.GetConnectionString("CinePlanet");
var app = builder.Build();

app.UseExceptionHandler(e => e.Run(c =>
{
    c.Response.StatusCode = 400;
    return c.Response.WriteAsJsonAsync(new { message = "Não deu pra salvar: título repetido ou campo faltando." });
}));
app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(Path.GetFullPath("../dashboard")),
    RequestPath = "/dashboard"
});

FilmesController.Map(app, conexao, site);

app.Run();
