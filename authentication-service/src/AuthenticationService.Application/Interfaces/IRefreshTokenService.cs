using AuthenticationService.Application.DTOs;

namespace AuthenticationService.Application.Interfaces;

public interface IRefreshTokenService
{
    Task<(string rawToken, Guid familyId)> CreateAsync(string userId, Guid? familyId = null);
    Task<RefreshResponseDto> RotateAsync(string rawToken);
    Task RevokeAsync(string rawToken);
}
