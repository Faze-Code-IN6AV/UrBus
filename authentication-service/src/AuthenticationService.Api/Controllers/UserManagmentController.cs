using System;
using AuthService.Application.DTOs;
using AuthService.Application.Services;
using AuthService.Application.Interfaces;
using AuthenticationService.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthenticationService.Api.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UserManagementController(IUserManagementService userManagementService) : ControllerBase
{
    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpPut("{userId}/role")]
    public async Task<IActionResult> UpdateRole(string userId, [FromQuery] string roleName)
    {
        var result = await userManagementService.UpdateUserRoleAsync(userId, roleName);
        return Ok(result);
    }

    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpGet("{userId}/roles")]
    public async Task<IActionResult> GetUserRoles(string userId)
    {
        var roles = await userManagementService.GetUserRolesAsync(userId);
        return Ok(roles);
    }

    [Authorize(Roles = "ADMIN_ROLE")]
    [HttpGet("by-role")]
    public async Task<IActionResult> GetUsersByRole([FromQuery] string roleName)
    {
        var users = await userManagementService.GetUsersByRoleAsync(roleName);
        return Ok(users);
    }
}