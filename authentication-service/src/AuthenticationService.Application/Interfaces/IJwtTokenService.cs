using AuthenticationService.Domain.Entities;

namespace AuthService.Application.Interfaces;

public interface IJwtTokenService
{
    string GenerateToken(User user);
    Task<String> GenerateTokenAsync(string userId, int expiresInMinutes = 15);
}
