using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using System.Security.Claims;

namespace AuthenticationService.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Tags("Profile")]
public class ProfileController(IUserManagementService userManagementService) : ControllerBase
{
    [Authorize]
    [HttpPut("{userId}/profile")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [ProducesResponseType(typeof(UserResponseDto), 200)]
    [ProducesResponseType(400)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> UpdateProfile(string userId, [FromForm] UpdateProfileDto dto)
    {
        var requestingUserId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
                              ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (requestingUserId is null)
            return Unauthorized();

        var isAdmin = User.HasClaim("role", "ADMIN_ROLE");

        if (!isAdmin && requestingUserId != userId)
            return Forbid();

        var result = await userManagementService.UpdateProfileAsync(userId, dto);
        return Ok(result);
    }
}