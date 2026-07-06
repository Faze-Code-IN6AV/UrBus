using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthenticationService.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
[Tags("User Management")]
public class UserManagementController(IUserManagementService userManagementService) : ControllerBase
{
    /// <summary>Listar todos los usuarios con su rol</summary>
    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpGet]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> GetAllUsers()
    {
        var allUsers = await userManagementService.GetAllUsersAsync();
        return Ok(allUsers);
    }

    /// <summary>Actualizar rol de usuario</summary>
    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpPut("{userId}/role")]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    [ProducesResponseType(403)]
    public async Task<IActionResult> UpdateRole(string userId, [FromQuery] string roleName)
    {
        var result = await userManagementService.UpdateUserRoleAsync(userId, roleName);
        return Ok(result);
    }

    /// <summary>Obtener roles de un usuario</summary>
    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpGet("{userId}/roles")]
    [ProducesResponseType(200)]
    public async Task<IActionResult> GetUserRoles(string userId)
    {
        var roles = await userManagementService.GetUserRolesAsync(userId);
        return Ok(roles);
    }

    /// <summary>Listar usuarios por rol</summary>
    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpGet("by-role")]
    [ProducesResponseType(200)]
    public async Task<IActionResult> GetUsersByRole([FromQuery] string roleName)
    {
        var users = await userManagementService.GetUsersByRoleAsync(roleName);
        return Ok(users);
    }
}