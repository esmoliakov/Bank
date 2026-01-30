using Models;
using Models.DTOs;

namespace Services;

public interface IAccountService
{
    Task<AccountResponseDto> CreateAccountAsync(AccountCreateDto dto);
    Task<AccountResponseDto> GetAccountByIdAsync(int accountId);
    Task<AccountResponseDto> UpdateAccountAsync(int accountId, AccountUpdateDto dto);
    Task<bool> DeleteAccountAsync(int accountId);
}
