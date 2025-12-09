using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Npgsql;
using QuestPDF.Infrastructure;



var builder = WebApplication.CreateBuilder(args);
builder.Logging.SetMinimumLevel(LogLevel.Debug);
builder.Logging.AddConsole();

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSingleton<Database>();
//builder.Services.AddSingleton<AdminSession>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}
QuestPDF.Settings.License = LicenseType.Community;
app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();


app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();
