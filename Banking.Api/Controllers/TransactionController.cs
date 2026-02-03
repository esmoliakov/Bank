using Microsoft.AspNetCore.Mvc;
using Services;
using Models.DTOs;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionService _transactionService;

    public TransactionsController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    // POST: api/transactions
    [HttpPost]
    public async Task<ActionResult<TransactionResponseDto>> CreateTransaction(
        [FromBody] TransactionCreateDto dto)
    {
        try
        {
            var transaction = await _transactionService.CreateTransactionAsync(dto);

            return CreatedAtAction(
                nameof(GetTransactionById),
                new { transactionId = transaction.TransactionId },
                transaction
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    // GET: api/transactions/{transactionId}
    [HttpGet("{transactionId:int}")]
    public async Task<ActionResult<TransactionResponseDto>> GetTransactionById(int transactionId)
    {
        try
        {
            var transaction = await _transactionService.GetTransactionByIdAsync(transactionId);
            return Ok(transaction);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE: api/transactions/{transactionId}
    [HttpDelete("{transactionId:int}")]
    public async Task<IActionResult> DeleteTransaction(int transactionId)
    {
        var success = await _transactionService.DeleteTransactionAsync(transactionId);

        if (!success)
            return NotFound("Transaction not found.");

        return NoContent();
    }
}
