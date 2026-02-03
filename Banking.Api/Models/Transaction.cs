namespace Models;

public enum TransactionType
{
    Deposit,
    Withdrawal,
    Transfer
}

public enum TransactionStatus
{
    Pending,
    Completed,
    Failed
}

public class Transaction
{
    public int TransactionId { get; set; }

    public int? FromAccountId { get; set; }
    public int? ToAccountId { get; set; }

    public decimal Amount { get; set; }
    public Currency Currency { get; set; }

    public TransactionType TransactionType { get; set; }
    public TransactionStatus Status { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public decimal BalanceAfter { get; set; }
    public string? Description { get; set; }
}
