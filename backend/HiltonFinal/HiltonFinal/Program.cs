

using Microsoft.EntityFrameworkCore;
using HiltonFinal.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// ——— Swagger/OpenAPI ———
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ——— EF Core ———
builder.Services.AddDbContext<EntertainerDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("EntertainmentConnection"))
);

// ——— CORS ———
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000")   // or whatever your Vite URL is (e.g. http://localhost:5173)
            .AllowAnyMethod()                       // GET, POST, PUT, DELETE, etc.
            .AllowAnyHeader()                       // Content-Type, Authorization, etc.
            .AllowCredentials();                    // if you need cookies/auth
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// NOTE: CORS must go before MapControllers()
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
