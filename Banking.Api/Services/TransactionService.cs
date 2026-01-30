using Models;
using Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Data;

namespace Services;

public class TransactionService : ITransactionService
{
    private readonly AppDbContext _context;

    public TransactionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TransactionResponseDto> CreateTransactionAsync(TransactionCreateDto dto)
    {
        if (dto.Amount <= 0)
            throw new ArgumentException("Amount must be greater than 0.");

        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.AccountId == dto.AccountId);

        if (account == null)
            throw new KeyNotFoundException("Account not found.");

        Account? fromAccount = null;
        Account? toAccount = null;

        if (dto.TransactionType == TransactionType.Withdrawal || dto.TransactionType == TransactionType.Transfer)
        {
            if (dto.FromAccountId == null)
                throw new ArgumentException("FromAccountId is required for withdrawal/transfer.");

            fromAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountId == dto.FromAccountId);

            if (fromAccount == null)
                throw new KeyNotFoundException("From account not found.");

            if (!fromAccount.IsActive)
                throw new InvalidOperationException("From account is inactive.");

            if (dto.Amount > fromAccount.Balance)
                throw new InvalidOperationException("Insufficient balance.");
        }

        if (dto.TransactionType == TransactionType.Transfer)
        {
            if (dto.ToAccountId == null)
                throw new ArgumentException("ToAccountId is required for transfer.");

            toAccount = await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountId == dto.ToAccountId);

            if (toAccount == null)
                throw new KeyNotFoundException("To account not found.");

            if (!toAccount.IsActive)
                throw new InvalidOperationException("To account is inactive.");
        }

        if (dto.TransactionType == TransactionType.Deposit)
        {
            account.Deposit(dto.Amount);
        }
        else if (dto.TransactionType == TransactionType.Withdrawal)
        {
            fromAccount!.Withdraw(dto.Amount);
        }
        else if (dto.TransactionType == TransactionType.Transfer)
        {
            fromAccount!.Withdraw(dto.Amount);
            toAccount!.Deposit(dto.Amount);
        }

        var transaction = new Transaction
        {
            AccountId = dto.AccountId,
            FromAccountId = dto.FromAccountId,
            ToAccountId = dto.ToAccountId,
            Amount = dto.Amount,
            Currency = dto.Currency,
            TransactionType = dto.TransactionType,
            Status = TransactionStatus.Completed,
            BalanceAfter = account.Balance,
            Description = dto.Description
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<TransactionResponseDto> GetTransactionByIdAsync(int transactionId)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.TransactionId == transactionId);

        if (transaction == null)
            throw new KeyNotFoundException("Transaction not found.");

        return MapToDto(transaction);
    }

    public async Task<TransactionResponseDto> UpdateTransactionAsync(int userId, TransactionUpdateDto dto)
    {
        var transaction = await _context.Transactions
            .Include(t => t.Account)
            .FirstOrDefaultAsync(t => t.Account!.UserId == userId);

        if (transaction == null)
            throw new KeyNotFoundException("Transaction not found.");

        transaction.Status = dto.Status;

        await _context.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<bool> DeleteTransactionAsync(int transactionId)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.TransactionId == transactionId);

        if (transaction == null)
            return false;

        _context.Transactions.Remove(transaction);
        await _context.SaveChangesAsync();
        return true;
    }

    private static TransactionResponseDto MapToDto(Transaction transaction)
    {
        return new TransactionResponseDto(
            transaction.TransactionId,
            transaction.AccountId,
            transaction.FromAccountId,
            transaction.ToAccountId,
            transaction.Amount,
            transaction.Currency,
            transaction.TransactionType,
            transaction.Status,
            transaction.CreatedAt,
            transaction.BalanceAfter,
            transaction.Description
        );
    }
}
