namespace Models.DTOs;

public record UserCreateDto(
    string FullName,
    DateOnly DateOfBirth,
    string? PhoneNumber,
    string? Email,
    string? Address,
    string? UserName,
    string Password
);

public record UserUpdateDto(
    string? PhoneNumber,
    string? Email,
    string? Address,
    string? UserName
);

public record UserResponseDto(
    int UserId,
    string FullName,
    DateOnly DateOfBirth,
    string? PhoneNumber,
    string? Email,
    string? Address,
    string? UserName,
    bool TwoFactorEnabled,
    bool IsActive,
    DateTime CreatedAt
);
