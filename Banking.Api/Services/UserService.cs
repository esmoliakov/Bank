using Models;
using Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using Data;


namespace Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<UserResponseDto> CreateUserAsync(UserCreateDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.UserName))
            throw new ArgumentException("UserName is required.");

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == dto.UserName || u.Email == dto.Email);

        if (existingUser != null)
            throw new InvalidOperationException("User with the same username or email already exists.");

        var user = new User
        {
            FullName = dto.FullName,
            DateOfBirth = dto.DateOfBirth,
            PhoneNumber = dto.PhoneNumber,
            Email = dto.Email,
            Address = dto.Address,
            UserName = dto.UserName,
            IsActive = true,
            TwoFactorEnabled = false
        };


        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserResponseDto> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        return MapToDto(user);
    }

    public async Task<UserResponseDto> UpdateUserAsync(int userId, UserUpdateDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            throw new KeyNotFoundException("User not found.");

        if (!string.IsNullOrWhiteSpace(dto.PhoneNumber))
            user.PhoneNumber = dto.PhoneNumber;

        if (!string.IsNullOrWhiteSpace(dto.Email))
            user.Email = dto.Email;

        if (!string.IsNullOrWhiteSpace(dto.Address))
            user.Address = dto.Address;

        if (!string.IsNullOrWhiteSpace(dto.UserName))
            user.UserName = dto.UserName;

        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
            return false;

        user.IsActive = false;
        await _context.SaveChangesAsync();

        return true;
    }

    private static UserResponseDto MapToDto(User user)
    {
        return new UserResponseDto(
            user.UserId,
            user.FullName ?? "",
            user.DateOfBirth,
            user.PhoneNumber,
            user.Email,
            user.Address,
            user.UserName,
            user.TwoFactorEnabled,
            user.IsActive,
            user.CreatedAt
        );
    }

    private static void CreatePasswordHash(string password, out string hash, out string salt)
    {
        using var hmac = new HMACSHA512();
        salt = Convert.ToBase64String(hmac.Key);
        hash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
    }

    private static bool VerifyPassword(string password, string hash, string salt)
    {
        var key = Convert.FromBase64String(salt);
        using var hmac = new HMACSHA512(key);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(computedHash) == hash;
    }
}
