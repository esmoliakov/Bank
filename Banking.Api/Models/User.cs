using System.Security.Cryptography.X509Certificates;

namespace Models;

public class User
{
    public int UserId {get; set;}
    public string? FullName {get; set;}
    public DateOnly DateOfBirth {get; set;}
    public string? PhoneNumber {get; set;}
    public string? Email { get; set; }
    public string? Address {get; set;}
    public string? UserName {get; set;}
    public string PasswordHash { get; private set; } = default!;
    public string PasswordSalt { get; private set; } = default!;

    public bool TwoFactorEnabled {get; set;}
    public DateTime CreatedAt {get; set;}
    public bool IsActive {get; set;}

    public User()
    {
        CreatedAt = DateTime.UtcNow;
    }

    public void SetPassword(string hash, string salt)
    {
        PasswordHash = hash;
        PasswordSalt = salt;
    }
}
