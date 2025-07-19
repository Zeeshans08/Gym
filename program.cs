using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

// Mock user database
var users = new Dictionary<string, User>
{
    ["user@example.com"] = new User 
    { 
        Password = "securepassword123", 
        Name = "John Doe", 
        Membership = "premium" 
    }
};

app.MapPost("/login", (LoginRequest request) =>
{
    if (users.TryGetValue(request.Email, out var user) && user.Password == request.Password)
    {
        return Results.Ok(new
        {
            Success = true,
            Message = "Login successful",
            User = new { user.Name, user.Membership }
        });
    }
    
    return Results.Unauthorized();
});

app.MapPost("/contact", (ContactRequest request) =>
{
    // In a real app, you would save this to a database
    System.Console.WriteLine($"New contact form submission: {request.Name} <{request.Email}> - {request.Subject}: {request.Message}");
    
    return Results.Ok(new
    {
        Success = true,
        Message = "Thank you for your message! We'll get back to you soon."
    });
});

app.Run();

// Request models
record LoginRequest(string Email, string Password);
record ContactRequest(string Name, string Email, string Subject, string Message);

class User
{
    public string Password { get; set; }
    public string Name { get; set; }
    public string Membership { get; set; }
}