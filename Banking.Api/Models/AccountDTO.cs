namespace Models.DTOs;

public record AccountCreateDto(
    int UserId,
    AccountType AccountType,
    Currency Currency,
    decimal InitialDeposit
);

public record AccountUpdateDto(
    bool IsActive
);


public record AccountResponseDto(
    int AccountId,
    long AccountNumber,
    AccountType AccountType,
    decimal Balance,
    Currency Currency,
    bool IsActive,
    DateTime CreatedAt
);
