using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class LoginDto
{
    /// <example>john.doe@example.com</example>
    [Required]
    public string EmailOrUsername { get; set; } = string.Empty;

    /// <example>MyPassword123</example>
    [Required]
    public string Password { get; set; } = string.Empty;
}
