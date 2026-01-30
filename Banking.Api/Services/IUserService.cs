using Models;
using Models.DTOs;

namespace Services;

public interface IUserService
{
    Task<UserResponseDto> CreateUserAsync(UserCreateDto dto);
    Task<UserResponseDto> GetUserByIdAsync(int userId);
    Task<UserResponseDto> UpdateUserAsync(int userId, UserUpdateDto dto);
    Task<bool> DeleteUserAsync(int userId);
}