using Microsoft.AspNetCore.Mvc;
using Services;
using Models.DTOs;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountsController : ControllerBase
{
    private readonly IAccountService _accountService;

    public AccountsController(IAccountService accountService)
    {
        _accountService = accountService;
    }

    // POST: api/accounts
    [HttpPost]
    public async Task<ActionResult<AccountResponseDto>> CreateAccount(
        [FromBody] AccountCreateDto dto)
    {
        var result = await _accountService.CreateAccountAsync(dto);

        return CreatedAtAction(
            nameof(GetAccountById),
            new { accountId = result.AccountId },
            result
        );
    }

    // GET: api/accounts/{accountId}
    [HttpGet("{accountId:int}")]
    public async Task<ActionResult<AccountResponseDto>> GetAccountById(int accountId)
    {
        try
        {
            var account = await _accountService.GetAccountByIdAsync(accountId);
            return Ok(account);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // PUT: api/accounts/{accountId}
    [HttpPut("{accountId:int}")]
    public async Task<ActionResult<AccountResponseDto>> UpdateAccount(
        int accountId,
        [FromBody] AccountUpdateDto dto)
    {
        try
        {
            var updated = await _accountService.UpdateAccountAsync(accountId, dto);
            return Ok(updated);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE: api/accounts/{accountId}
    [HttpDelete("{accountId:int}")]
    public async Task<IActionResult> DeleteAccount(int accountId)
    {
        var success = await _accountService.DeleteAccountAsync(accountId);

        if (!success)
            return NotFound("Account not found.");

        return NoContent();
    }
}
