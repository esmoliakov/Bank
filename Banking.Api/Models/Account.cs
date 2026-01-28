using Microsoft.AspNetCore.SignalR;
using Microsoft.Net.Http.Headers;

namespace Models;

public enum AccountType
{
    Checking,
    Savings
}

public enum Currency
{
    USD,
    EUR,
    GBP
}

public class Account
{
    public int AccountId {get; set;}
    public int UserId {get; set;}
    public long AccountNumber {get; set;}
    public AccountType AccountType {get; set;}
    public decimal Balance {get; private set;} = 0;
    public Currency Currency {get; set;}
    public bool IsActive {get; set;}
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User {get; set;}

}
