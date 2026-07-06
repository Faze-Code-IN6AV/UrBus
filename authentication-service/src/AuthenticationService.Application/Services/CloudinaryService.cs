using System;
using System.Text.RegularExpressions;
using AuthService.Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace AuthService.Application.Services;

public class CloudinaryService(IConfiguration configuration) : ICloudinaryService
{
    private readonly Cloudinary _cloudinary = new(new Account(
        configuration["CloudinarySettings:Cloudname"],
        configuration["CloudinarySettings:ApiKey"],
        configuration["CloudinarySettings:ApiSecret"]
    ));

    public async Task<bool> DeleteImageAsync(string publicId)
    {
        try{
            var deleteParams = new DelResParams{
                PublicIds = [publicId]
            };

            var result = await _cloudinary.DeleteResourcesAsync(deleteParams);
            return result.Deleted?.ContainsKey(publicId) == true;
        } catch {
            return false;
        }
    }

    public string GetDefaultAvatarUrl()
    {
        var defaultPath = configuration["CloudinarySettings:DefaultAvatarPath"] ?? "avatarDefault-1749508519496.png";
        
        if(defaultPath.Contains('/')) return defaultPath.Split('/').Last();
        
        return defaultPath;
    }

    public string GetFullImageUrl(string imagePath)
    {
        var defaultAvatarPath = configuration["CloudinarySettings:DefaultAvatarPath"] ?? "avatarDefault-1749508519496.png";
        var defaultAvatarFileName = defaultAvatarPath.Contains('/') ? defaultAvatarPath.Split('/').Last() : defaultAvatarPath;

        // Si no hay imagen real (o el valor guardado es justo el placeholder por defecto),
        // no armamos una URL hacia Cloudinary: puede que ese archivo no exista en la cuenta
        // configurada. Regresamos vacío y el frontend cae a su imagen local (assets/img/user.png).
        if (string.IsNullOrWhiteSpace(imagePath) || imagePath == defaultAvatarFileName)
        {
            return string.Empty;
        }

        if (Uri.IsWellFormedUriString(imagePath, UriKind.Absolute))
        {
            return imagePath;
        }

        var baseUrl = configuration["CloudinarySettings:BaseUrl"] ?? "https://res.cloudinary.com/depgwnl2z/image/upload/v1770923104/";
        var folder = configuration["CloudinarySettings:Folder"] ?? "urBus/profiles";

        baseUrl = Regex.Replace(baseUrl, "/v\\d+/?$", "/");
        if (!baseUrl.EndsWith('/')) baseUrl += '/';

        var pathToUse = imagePath.TrimStart('/');
        if (!pathToUse.Contains('/')) pathToUse = $"{folder}/{pathToUse}";

        return $"{baseUrl}{pathToUse}";
    }

    public async Task<string> UploadImageAsync(IFileData imageFile, string fileName)
    {
        try {
            using var stream = new MemoryStream(imageFile.Data);

            var folder = configuration["CloudinarySettings:Folder"] ?? "urBus/profiles";

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(imageFile.FileName, stream),
                PublicId = $"{folder}/{fileName}",
                Folder = folder,
                Transformation = new Transformation()
                    .Width(400)
                    .Height(400)
                    .Crop("fill")
                    .Gravity("face")
                    .Quality("auto")
                    .FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if(uploadResult.Error != null){
                throw new InvalidOperationException($"Error al subir la imagen: {uploadResult.Error.Message}");
            }

            return fileName;
        } catch (Exception ex) {
            throw new InvalidOperationException($"Error uploading the imagen to Cloudinary: {ex.Message}", ex);
        }
    }
}