using System;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    /// <summary>Iniciar sesión</summary>
    /// <remarks>Sujeto a rate limiting (AuthPolicy)</remarks>
    /// <response code="200">Token JWT y datos del usuario</response>
    /// <response code="400">Credenciales inválidas</response>
    /// <response code="429">Rate limit excedido</response>
    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        var result = await authService.LoginAsync(loginDto);

        return Ok(result);
    }

    /// <summary>Registrar nuevo usuario</summary>
    /// <remarks>Acepta multipart/form-data. Tamaño máximo: 10MB. Se envía email de verificación.</remarks>
    /// <response code="201">Usuario creado, verificación pendiente</response>
    /// <response code="400">Email/username duplicado o archivo inválido</response>
    [HttpPost("register")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
    {
        var result = await authService.RegisterAsync(registerDto);
        
        return StatusCode(201, result);
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var result = await authService.VerifyEmailAsync(verifyEmailDto);

        return Ok(result);
    }
}
