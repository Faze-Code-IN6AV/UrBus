using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using AuthenticationService.Domain.Constants;
using AuthenticationService.Application.Interfaces;
using AuthenticationService.Application.DTOs;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/auth")]
[Tags("Authentication")]
public class AuthController(
    IAuthService authService,
    IUserManagementService userManagementService,
    IRefreshTokenService refreshTokenService) : ControllerBase
{
    /// <summary>Renovar access token usando refresh token</summary>
    [HttpPost("refresh")]
    [AllowAnonymous]
    [ProducesResponseType(200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Refresh([FromBody] RefreshRequestDto dto)
    {
        var result = await refreshTokenService.RotateAsync(dto.RefreshToken);
        return Ok(result);
    }

    /// <summary>Cerrar sesión (revoca el refresh token)</summary>
    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(200)]
    [ProducesResponseType(401)]
    public async Task<IActionResult> Logout([FromBody] RefreshRequestDto dto)
    {
        await refreshTokenService.RevokeAsync(dto.RefreshToken);
        return Ok(new { message = "Sesión cerrada" });
    }

    /// <summary>Iniciar sesión de usuario</summary>
    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(AuthResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        var result = await authService.LoginAsync(loginDto);
        return Ok(result);
    }

    /// <summary>Registrar nuevo usuario</summary>
    /// <remarks>Envía imagen opcional (multipart/form-data)</remarks>
    [HttpPost("register")]
    [Consumes("multipart/form-data")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(RegisterResponseDto), 201)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
    {
        var result = await authService.RegisterAsync(registerDto);
        return StatusCode(201, result);
    }

    /// <summary>Verificar correo electrónico</summary>
    [HttpPost("verify-email")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto dto)
    {
        var result = await authService.VerifyEmailAsync(dto);
        return Ok(result);
    }

    /// <summary>Reenviar correo de verificación</summary>
    [HttpPost("resend-verification")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), 200)]
    [ProducesResponseType(typeof(EmailResponseDto), 400)]
    [ProducesResponseType(typeof(EmailResponseDto), 404)]
    [ProducesResponseType(typeof(EmailResponseDto), 503)]
    public async Task<ActionResult<EmailResponseDto>> ResendVerification([FromBody] ResendVerificationDto resendDto)
    {
        var result = await authService.ResendVerificationEmailAsync(resendDto);

        if (!result.Success)
        {
            if (result.Message.Contains("no encontrado", StringComparison.OrdinalIgnoreCase))
                return NotFound(result);

            if (result.Message.Contains("ya ha sido verificado", StringComparison.OrdinalIgnoreCase) ||
                result.Message.Contains("ya verificado", StringComparison.OrdinalIgnoreCase))
                return BadRequest(result);

            return StatusCode(503, result);
        }

        return Ok(result);
    }

    /// <summary>Solicitar recuperación de contraseña</summary>
    [HttpPost("forgot-password")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), 200)]
    [ProducesResponseType(typeof(EmailResponseDto), 503)]
    public async Task<ActionResult<EmailResponseDto>> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        var result = await authService.ForgotPasswordAsync(dto);

        if (!result.Success)
            return StatusCode(503, result);

        return Ok(result);
    }

    /// <summary>Restablecer contraseña</summary>
    [HttpPost("reset-password")]
    [EnableRateLimiting("AuthPolicy")]
    [ProducesResponseType(typeof(EmailResponseDto), 200)]
    [ProducesResponseType(400)]
    public async Task<ActionResult<EmailResponseDto>> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var result = await authService.ResetPasswordAsync(dto);
        return Ok(result);
    }

    // Método interno (no documentado en Swagger)
    private async Task<bool> CurrentUserIsAdmin()
    {
        var userId = User.Claims.FirstOrDefault(c =>
            c.Type == "sub" ||
            c.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;

        if (string.IsNullOrEmpty(userId)) return false;

        var roles = await userManagementService.GetUserRolesAsync(userId);
        return roles.Contains(RoleConstants.ADMIN_ROLE);
    }
}