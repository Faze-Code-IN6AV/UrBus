namespace AuthenticationService.Application.DTOs;

public record RefreshResponseDto(string Token, string RefreshToken, int ExpiresAt);
