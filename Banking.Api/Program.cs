using Data;
using Microsoft.EntityFrameworkCore;
using Services;
using DotNetEnv;
using System.Text.Json.Serialization;

Env.Load(); // Load environment variables from .env file

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Database Configuration
// --------------------
var dbHost = Environment.GetEnvironmentVariable("DB_HOST");
var dbPort = Environment.GetEnvironmentVariable("DB_PORT");
var dbName = Environment.GetEnvironmentVariable("DB_NAME");
var dbUser = Environment.GetEnvironmentVariable("DB_USER");
var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

var connectionString =
    $"Host={dbHost};Port={dbPort};Database={dbName};Username={dbUser};Password={dbPassword}";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString)
);

// --------------------
// Dependency Injection for Services
// --------------------
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();

// --------------------
// CORS Configuration
// --------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React dev server
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// --------------------
// Controllers + JSON options + Swagger
// --------------------
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// --------------------
// Middleware
// --------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS before mapping controllers
app.UseCors("AllowFrontend");

// Optional HTTPS redirection (commented out for local dev)
// app.UseHttpsRedirection();

app.MapControllers();

app.Run();
