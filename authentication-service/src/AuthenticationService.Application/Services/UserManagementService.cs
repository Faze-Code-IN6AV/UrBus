using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthenticationService.Domain.Constants;
using AuthenticationService.Domain.Entities;
using AuthenticationService.Domain.Interfaces;
using AuthService.Application.Validators;

namespace AuthService.Application.Services;

public class UserManagementService(IUserRepository users, IRoleRepository roles, ICloudinaryService cloudinary) : IUserManagementService
{
    public async Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Invalid userId", nameof(userId));
        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role not allowed. Use {RoleConstants.ADMIN_ROLE} or {RoleConstants.USER_ROLE}");

        var user = await users.GetByIdAsync(userId);

        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);
            if (adminCount <= 1)
                throw new InvalidOperationException("Cannot remove the last administrator");
        }

        var role = await roles.GetByNameAsync(roleName)
                       ?? throw new InvalidOperationException($"Role {roleName} not found");

        await users.UpdateUserRoleAsync(userId, role.Id);

        user = await users.GetByIdAsync(userId);

        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Username = user.Username,
            Email = user.Email,
            ProfilePicture = cloudinary.GetFullImageUrl(user.UserProfile?.ProfilePicture ?? string.Empty),
            Phone = user.UserProfile?.Phone ?? string.Empty,
            Role = role.Name,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public async Task<IReadOnlyList<string>> GetUserRolesAsync(string userId)
    {
        var roleNames = await roles.GetUserRoleNamesAsync(userId);
        return roleNames;
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        var usersInRole = await roles.GetUsersByRoleAsync(roleName);
        return usersInRole.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name,
            Surname = u.Surname,
            Username = u.Username,
            Email = u.Email,
            ProfilePicture = cloudinary.GetFullImageUrl(u.UserProfile?.ProfilePicture ?? string.Empty),
            Phone = u.UserProfile?.Phone ?? string.Empty,
            Role = roleName,
            Status = u.Status,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }

    public async Task<UserResponseDto> UpdateProfileAsync(string userId, UpdateProfileDto dto)
    {
        var user = await users.GetByIdAsync(userId);

        user.Name = dto.Name.Trim();
        user.Surname = dto.Surname.Trim();
        user.UpdatedAt = DateTime.UtcNow;

        if (user.UserProfile != null)
        {
            user.UserProfile.Phone = dto.Phone.Trim();

            if (dto.ProfilePicture != null && dto.ProfilePicture.Size > 0)
            {
                var (isValid, errorMessage) = FileValidator.ValidateImage(dto.ProfilePicture);
                if (!isValid)
                    throw new InvalidOperationException(errorMessage ?? "Archivo inválido");

                // FIX: Comparar solo el nombre de archivo, no construir publicId con la ruta hardcodeada
                // GetDefaultAvatarUrl() ya retorna solo el nombre del archivo
                var currentPic = user.UserProfile.ProfilePicture;
                var defaultAvatar = cloudinary.GetDefaultAvatarUrl();

                if (!string.IsNullOrEmpty(currentPic) && currentPic != defaultAvatar)
                {
                    // El publicId en Cloudinary es "folder/filename" sin extensión
                    // currentPic almacena solo el filename (sin ruta)
                    var publicId = $"auth_ks_in6av/profiles/{Path.GetFileNameWithoutExtension(currentPic)}";
                    await cloudinary.DeleteImageAsync(publicId);
                }

                var fileName = FileValidator.GenerateSecureFileName(dto.ProfilePicture.FileName);
                user.UserProfile.ProfilePicture = await cloudinary.UploadImageAsync(dto.ProfilePicture, fileName);
            }
        }

        await users.UpdateUserAsync(user);

        var role = user.UserRoles.FirstOrDefault()?.Role?.Name ?? string.Empty;

        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Username = user.Username,
            Email = user.Email,
            ProfilePicture = cloudinary.GetFullImageUrl(user.UserProfile?.ProfilePicture ?? string.Empty),
            Phone = user.UserProfile?.Phone ?? string.Empty,
            Role = role,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}