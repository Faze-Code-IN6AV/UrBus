using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthenticationService.Domain.Constants;
using AuthenticationService.Domain.Entities;
using AuthenticationService.Domain.Interfaces;
using AuthService.Application.Validators;

namespace AuthService.Application.Services;

public class UserManagementService(
    IUserRepository users,
    IRoleRepository roles,
    ICloudinaryService cloudinary,
    IEmailService emailService) : IUserManagementService
{
    public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
    {
        var allUsers = await users.GetAllUsersAsync();

        return allUsers.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name,
            Surname = u.Surname,
            Username = u.Username,
            Email = u.Email,
            ProfilePicture = cloudinary.GetFullImageUrl(u.UserProfile?.ProfilePicture ?? string.Empty),
            Phone = u.UserProfile?.Phone ?? string.Empty,
            Role = u.UserRoles.FirstOrDefault()?.Role?.Name ?? string.Empty,
            Status = u.Status,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }

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

    // Verificación manual de email por parte de un administrador.
    // Alternativa a la verificación por correo (SMTP), útil cuando el envío de emails
    // no está disponible en el entorno de despliegue (ej. Render).
    public async Task<UserResponseDto> VerifyUserEmailAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("Invalid userId", nameof(userId));

        var user = await users.GetByIdAsync(userId);

        if (user.UserEmail == null)
            throw new InvalidOperationException("El usuario no tiene información de verificación de email");

        if (user.UserEmail.EmailVerified)
            throw new InvalidOperationException("El email de este usuario ya ha sido verificado");

        user.UserEmail.EmailVerified = true;
        user.UserEmail.EmailVerificationToken = null;
        user.UserEmail.EmailVerificationTokenExpiry = null;
        user.Status = true;
        user.UpdatedAt = DateTime.UtcNow;

        var updatedUser = await users.UpdateUserAsync(user);

        // Enviar email de bienvenida en background (best-effort, no bloquea la respuesta)
        _ = Task.Run(async () =>
        {
            try
            {
                await emailService.SendWelcomeEmailAsync(updatedUser.Email, updatedUser.Username);
            }
            catch
            {
                // Best-effort: si el SMTP falla (como en el despliegue de Render),
                // la verificación administrativa ya quedó aplicada de todos modos.
            }
        });

        var role = updatedUser.UserRoles.FirstOrDefault()?.Role?.Name ?? string.Empty;

        return new UserResponseDto
        {
            Id = updatedUser.Id,
            Name = updatedUser.Name,
            Surname = updatedUser.Surname,
            Username = updatedUser.Username,
            Email = updatedUser.Email,
            ProfilePicture = cloudinary.GetFullImageUrl(updatedUser.UserProfile?.ProfilePicture ?? string.Empty),
            Phone = updatedUser.UserProfile?.Phone ?? string.Empty,
            Role = role,
            Status = updatedUser.Status,
            IsEmailVerified = updatedUser.UserEmail?.EmailVerified ?? false,
            CreatedAt = updatedUser.CreatedAt,
            UpdatedAt = updatedUser.UpdatedAt
        };
    }

    // Información de contacto de una cuenta (nombre, apellido, usuario, teléfono, email, fecha de creación).
    // Usado por ADMIN y DRIVER para ver los datos de una cuenta vinculada a un pasajero
    // (ej. para poder llamar a un pasajero ausente).
    public async Task<UserResponseDto> GetUserByIdAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            throw new ArgumentException("Invalid userId", nameof(userId));

        var user = await users.GetByIdAsync(userId);
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