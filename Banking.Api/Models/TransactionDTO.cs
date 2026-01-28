namespace Models.DTOs;

public record TransactionCreateDto(
    int AccountId,
    int? FromAccountId,
    int? ToAccountId,
    decimal Amount,
    Currency Currency,
    TransactionType TransactionType,
    string? Description
);

public record TransactionUpdateDto(
    TransactionStatus Status
);

public record TransactionResponseDto(
    int TransactionId,
    int AccountId,
    int? FromAccountId,
    int? ToAccountId,
    decimal Amount,
    Currency Currency,
    TransactionType TransactionType,
    TransactionStatus Status,
    DateTime CreatedAt,
    decimal BalanceAfter,
    string? Description
);
