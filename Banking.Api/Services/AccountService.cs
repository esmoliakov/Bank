using Models.DTOs;
using Models;
using Data;
using Microsoft.EntityFrameworkCore;

namespace Services;

public class AccountService : IAccountService
{
    private readonly AppDbContext _context;

    public AccountService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AccountResponseDto> CreateAccountAsync(AccountCreateDto dto)
    {
        if (dto.InitialDeposit < 0)
            throw new ArgumentException("Initial deposit cannot be negative.");

        var account = new Account
        {
            UserId = dto.UserId,
            AccountType = dto.AccountType,
            Currency = dto.Currency,
            IsActive = true,
            AccountNumber = GenerateAccountNumber()
        };

        _context.Accounts.Add(account);
        await _context.SaveChangesAsync();

        if (dto.InitialDeposit > 0)
        {
            account.Deposit(dto.InitialDeposit);

            var transaction = new Transaction
            {
                FromAccountId = account.AccountId,
                Amount = dto.InitialDeposit,
                Currency = account.Currency,
                TransactionType = TransactionType.Deposit,
                Status = TransactionStatus.Completed,
                BalanceAfter = account.Balance,
                Description = "Initial deposit"
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();
        }

        return MapToDto(account);
    }

    
    public async Task<AccountResponseDto> GetAccountByIdAsync(int accountId)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.AccountId == accountId);

        if (account is null)
            throw new KeyNotFoundException("Account not found.");

        return MapToDto(account);
    }

    public async Task<List<AccountResponseDto>> GetAllAccountsAsync()
    {
        var accounts = await _context.Accounts
                .Where(a => a.IsActive)
                .ToListAsync();
        return accounts.Select(MapToDto).ToList();
    }

    public async Task<AccountResponseDto> UpdateAccountAsync(int accountId, AccountUpdateDto dto)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.AccountId == accountId);

        if (account is null)
            throw new KeyNotFoundException("Account not found.");

        account.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return MapToDto(account);
    }

    public async Task<bool> DeleteAccountAsync(int accountId)
    {
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.AccountId == accountId);

        if (account is null)
            return false;

        account.IsActive = false;

        await _context.SaveChangesAsync();
        return true;
    }

    private static long GenerateAccountNumber()
    {
        return Random.Shared.NextInt64(1_000_000_000, 9_999_999_999);
    }

    private static AccountResponseDto MapToDto(Account account)
    {
        return new AccountResponseDto(
            account.AccountId,
            account.AccountNumber,
            account.AccountType,
            account.Balance,
            account.Currency,
            account.IsActive,
            account.CreatedAt
        );
    }
}