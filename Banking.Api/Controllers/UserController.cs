using Microsoft.AspNetCore.Mvc;
using Services;
using Models.DTOs;

namespace Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult<UserResponseDto>> CreateUser(
        [FromBody] UserCreateDto dto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(dto);

            return CreatedAtAction(
                nameof(GetUserById),
                new { userId = user.UserId },
                user
            );
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    // GET: api/users/{userId}
    [HttpGet("{userId:int}")]
    public async Task<ActionResult<UserResponseDto>> GetUserById(int userId)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(userId);
            return Ok(user);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // PUT: api/users/{userId}
    [HttpPut("{userId:int}")]
    public async Task<ActionResult<UserResponseDto>> UpdateUser(
        int userId,
        [FromBody] UserUpdateDto dto)
    {
        try
        {
            var updatedUser = await _userService.UpdateUserAsync(userId, dto);
            return Ok(updatedUser);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE: api/users/{userId}
    [HttpDelete("{userId:int}")]
    public async Task<IActionResult> DeleteUser(int userId)
    {
        var success = await _userService.DeleteUserAsync(userId);

        if (!success)
            return NotFound("User not found.");

        return NoContent();
    }
}
