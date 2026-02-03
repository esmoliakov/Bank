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

        var fromAccount = await _context.Accounts
            .FirstOrDefaultAsync(a => a.AccountId == dto.FromAccountId);

        if (fromAccount == null)
            throw new KeyNotFoundException("From account not found.");

        if (!fromAccount.IsActive)
            throw new InvalidOperationException("From account is inactive.");

        Account? toAccount = null;

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

        if (dto.TransactionType != TransactionType.Deposit &&
            dto.Amount > fromAccount.Balance)
            throw new InvalidOperationException("Insufficient balance.");

        using var dbTransaction = await _context.Database.BeginTransactionAsync();

        try
        {
            switch (dto.TransactionType)
            {
                case TransactionType.Deposit:
                    fromAccount.Deposit(dto.Amount);
                    break;

                case TransactionType.Withdrawal:
                    fromAccount.Withdraw(dto.Amount);
                    break;

                case TransactionType.Transfer:
                    fromAccount.Withdraw(dto.Amount);
                    toAccount!.Deposit(dto.Amount);
                    break;
            }

            var transaction = new Transaction
            {
                FromAccountId = fromAccount.AccountId,
                ToAccountId = dto.TransactionType == TransactionType.Transfer
                    ? dto.ToAccountId
                    : null,
                Amount = dto.Amount,
                Currency = fromAccount.Currency,
                TransactionType = dto.TransactionType,
                Status = TransactionStatus.Completed,
                BalanceAfter = fromAccount.Balance,
                Description = dto.Description
            };

            _context.Transactions.Add(transaction);

            await _context.SaveChangesAsync();
            await dbTransaction.CommitAsync();

            return MapToDto(transaction);
        }
        catch
        {
            await dbTransaction.RollbackAsync();
            throw;
        }
    }

    public async Task<TransactionResponseDto> GetTransactionByIdAsync(int transactionId)
    {
        var transaction = await _context.Transactions
            .FirstOrDefaultAsync(t => t.TransactionId == transactionId);

        if (transaction == null)
            throw new KeyNotFoundException("Transaction not found.");

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
