using Models;
using Models.DTOs;

namespace Services;

public interface ITransactionService
{
    Task<TransactionResponseDto> CreateTransactionAsync(TransactionCreateDto dto);
    Task<TransactionResponseDto> GetTransactionByIdAsync(int transactionId);
    Task<TransactionResponseDto> UpdateTransactionAsync(int userId, TransactionUpdateDto dto);
    Task<bool> DeleteTransactionAsync(int transactionId);
}