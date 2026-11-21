using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions { Args = args });
var contentRoot = builder.Environment.ContentRootPath;
var site = Path.GetFullPath(Path.Combine(contentRoot, "..", "cine-planet-site"));
var dashboard = Path.GetFullPath(Path.Combine(contentRoot, "..", "dashboard"));
var conexao = builder.Configuration.GetConnectionString("CinePlanet")
    ?? throw new InvalidOperationException("A connection string 'CinePlanet' não foi configurada.");

builder.Services.AddCors();
builder.Services.AddProblemDetails();

var app = builder.Build();

app.Urls.Add("http://0.0.0.0:5292");
app.UseExceptionHandler();
app.UseStatusCodePages();
app.UseCors(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new PhysicalFileProvider(site)
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(site)
});
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(dashboard),
    RequestPath = "/dashboard"
});

FilmesController.Map(app, conexao, site);

app.Run();
