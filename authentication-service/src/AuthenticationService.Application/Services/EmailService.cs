using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using AuthService.Application.Interfaces;

namespace AuthService.Application.Services;

public class EmailService(IConfiguration configuration, ILogger<EmailService> logger) : IEmailService
{
    public async Task SendEmailVerificationAsync(string email, string username, string token)
{
    var subject = "Verifica tu correo electrónico — UrBus";
    var verificationUrl = $"{configuration["AppSettings:FrontendUrl"]}/verify-email?token={token}";

    var body = $@"
<!DOCTYPE html>
<html lang='es'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body style='margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;'>

<table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;background:#f4f6fb;'>
<tr>
<td align='center'>

<table width='520' cellpadding='0' cellspacing='0'
style='background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>

<tr>
<td style='background:linear-gradient(135deg,#005691 0%,#03A9F4 100%);padding:40px;text-align:center;'>

<div style='display:inline-block;width:70px;height:70px;line-height:70px;border-radius:50%;background:#FFC107;font-size:34px;'>
🚌
</div>

<h1 style='margin:15px 0 0;color:#ffffff;font-size:24px;'>
UrBus
</h1>

</td>
</tr>

<tr>
<td style='padding:40px;'>

<h2 style='margin-top:0;color:#111827;'>
¡Bienvenido, {username}!
</h2>

<p style='font-size:15px;color:#6b7280;line-height:1.7;'>
Gracias por registrarte en UrBus. Para activar tu cuenta, verifica tu dirección de correo electrónico utilizando el siguiente botón.
</p>

<div style='background:#f8fafc;border-left:4px solid #03A9F4;padding:16px;border-radius:8px;margin:24px 0;'>
<p style='margin:0;color:#475569;'>
Este enlace expirará en 24 horas.
</p>
</div>

<div style='text-align:center;margin:30px 0;'>
<a href='{verificationUrl}'
style='display:inline-block;background:#FFC107;color:#005691;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;'>
Verificar correo
</a>
</div>

<p style='font-size:13px;color:#9ca3af;'>
Si el botón no funciona, copia y pega este enlace:
</p>

<p style='font-size:12px;color:#005691;word-break:break-all;'>
{verificationUrl}
</p>

</td>
</tr>

<tr>
<td style='padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;'>

<p style='margin:0;font-size:12px;color:#9ca3af;'>
Si no creaste una cuenta en UrBus, puedes ignorar este correo.
</p>

<p style='margin:8px 0 0;font-size:12px;color:#d1d5db;'>
© {DateTime.UtcNow.Year} UrBus Company
</p>

</td>
</tr>

<tr>
<td style='height:6px;background:linear-gradient(90deg,#005691 0%,#03A9F4 35%,#FFC107 70%,#EF6C00 100%);'></td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>";

    await SendEmailAsync(email, subject, body);
}

    public async Task SendPasswordResetAsync(string email, string username, string token)
{
    var subject = "Restablece tu contraseña — UrBus";
    var resetUrl = $"{configuration["AppSettings:FrontendUrl"]}/reset-password?token={token}";

    var body = $@"
<!DOCTYPE html>
<html lang='es'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body style='margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;'>

<table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;background:#f4f6fb;'>
<tr>
<td align='center'>

<table width='520' cellpadding='0' cellspacing='0'
style='background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>

<tr>
<td style='background:linear-gradient(135deg,#005691 0%,#03A9F4 100%);padding:40px;text-align:center;'>

<div style='display:inline-block;width:70px;height:70px;line-height:70px;border-radius:50%;background:#FFC107;font-size:34px;'>
🔒
</div>

<h1 style='margin:15px 0 0;color:#ffffff;font-size:24px;'>
UrBus
</h1>

</td>
</tr>

<tr>
<td style='padding:40px;'>

<h2 style='margin-top:0;color:#111827;'>
Hola, {username}
</h2>

<p style='font-size:15px;color:#6b7280;line-height:1.7;'>
Recibimos una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón para crear una nueva contraseña.
</p>

<div style='background:#fff8f0;border-left:4px solid #EF6C00;padding:16px;border-radius:8px;margin:24px 0;'>
<p style='margin:0;color:#92400e;'>
Este enlace es válido durante 1 hora y solo puede utilizarse una vez.
</p>
</div>

<div style='text-align:center;margin:30px 0;'>
<a href='{resetUrl}'
style='display:inline-block;background:#EF6C00;color:#ffffff;padding:14px 36px;border-radius:50px;text-decoration:none;font-weight:700;'>
Restablecer contraseña
</a>
</div>

<p style='font-size:13px;color:#9ca3af;'>
Si el botón no funciona, copia y pega este enlace:
</p>

<p style='font-size:12px;color:#005691;word-break:break-all;'>
{resetUrl}
</p>

</td>
</tr>

<tr>
<td style='padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;'>

<p style='margin:0;font-size:12px;color:#9ca3af;'>
Si no realizaste esta solicitud, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
</p>

<p style='margin:8px 0 0;font-size:12px;color:#d1d5db;'>
© {DateTime.UtcNow.Year} UrBus Company
</p>

</td>
</tr>

<tr>
<td style='height:6px;background:linear-gradient(90deg,#005691 0%,#03A9F4 35%,#FFC107 70%,#EF6C00 100%);'></td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>";

    await SendEmailAsync(email, subject, body);
}

    public async Task SendWelcomeEmailAsync(string email, string username)
{
    var subject = "¡Bienvenido a UrBus!";

    var body = $@"
<!DOCTYPE html>
<html lang='es'>
<head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1'>
</head>
<body style='margin:0;padding:0;background:#f4f6fb;font-family:Arial,sans-serif;'>

<table width='100%' cellpadding='0' cellspacing='0' style='padding:40px 0;background:#f4f6fb;'>
<tr>
<td align='center'>

<table width='520' cellpadding='0' cellspacing='0'
style='background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);'>

<tr>
<td style='background:linear-gradient(135deg,#005691 0%,#03A9F4 100%);padding:40px;text-align:center;'>

<div style='display:inline-block;width:70px;height:70px;line-height:70px;border-radius:50%;background:#FFC107;font-size:34px;'>
🎉
</div>

<h1 style='margin:15px 0 0;color:#ffffff;font-size:24px;'>
UrBus
</h1>

</td>
</tr>

<tr>
<td style='padding:40px;'>

<h2 style='margin-top:0;color:#111827;'>
¡Tu cuenta ya está lista, {username}!
</h2>

<p style='font-size:15px;color:#6b7280;line-height:1.7;'>
Tu correo electrónico fue verificado correctamente y tu cuenta ha sido activada.
</p>

<div style='background:#f8fafc;border-left:4px solid #03A9F4;padding:16px;border-radius:8px;margin:24px 0;'>
<p style='margin:0;color:#475569;'>
Ahora puedes acceder a todas las funcionalidades disponibles en la plataforma UrBus.
</p>
</div>

<div style='text-align:center;margin:30px 0;'>

<span style='display:inline-block;background:#FFC107;color:#005691;padding:14px 36px;border-radius:50px;font-weight:700;'>
✓ Cuenta activada
</span>

</div>

<p style='font-size:15px;color:#6b7280;line-height:1.7;'>
Gracias por confiar en UrBus. Esperamos que disfrutes la experiencia.
</p>

</td>
</tr>

<tr>
<td style='padding:20px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;'>

<p style='margin:0;font-size:12px;color:#9ca3af;'>
Gracias por formar parte de la comunidad UrBus.
</p>

<p style='margin:8px 0 0;font-size:12px;color:#d1d5db;'>
© {DateTime.UtcNow.Year} UrBus Company
</p>

</td>
</tr>

<tr>
<td style='height:6px;background:linear-gradient(90deg,#005691 0%,#03A9F4 35%,#FFC107 70%,#EF6C00 100%);'></td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>";

    await SendEmailAsync(email, subject, body);
}

    private async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpSettings = configuration.GetSection("SmtpSettings");

        try
        {
            // Verificar si el email está habilitado
            var enabled = bool.Parse(smtpSettings["Enabled"] ?? "true");
            if (!enabled)
            {
                logger.LogInformation("El envío de emails está deshabilitado en la configuración. Omitiendo envío");
                return;
            }

            // Validar configuración
            var host = smtpSettings["Host"];
            var portString = smtpSettings["Port"];
            var username = smtpSettings["Username"];
            var password = smtpSettings["Password"];
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                logger.LogError("La configuración SMTP no está configurada correctamente");
                throw new InvalidOperationException("La configuración SMTP no está configurada correctamente");
            }

            // Avoid logging sensitive SMTP details

            var port = int.Parse(portString ?? "587");

            using var client = new SmtpClient();

            // Configurar timeout
            var timeoutMs = int.Parse(smtpSettings["Timeout"] ?? "30000");
            client.Timeout = timeoutMs;

            try
            {
                // Configurar validación de certificados SSL
                var ignoreCertErrors = bool.Parse(smtpSettings["IgnoreCertificateErrors"] ?? "false");
                if (ignoreCertErrors)
                {
                    logger.LogWarning("Validación de certificados SSL deshabilitada. Solo usar en desarrollo.");
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;
                }
 
                // Verificar configuración de SSL implícito
                var useImplicitSsl = bool.Parse(smtpSettings["UseImplicitSsl"] ?? "false");

                // Configuración específica por puerto y SSL
                if (useImplicitSsl || port == 465)
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.SslOnConnect);
                }
                else if (port == 587)
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.StartTls);
                }
                else
                {
                    await client.ConnectAsync(host, port, SecureSocketOptions.Auto);
                }

                // Autenticación
                await client.AuthenticateAsync(username, password);

                // Crear mensaje con MimeKit
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(fromName, fromEmail));
                message.To.Add(new MailboxAddress("", to));
                message.Subject = subject;
                message.Body = new TextPart("html") { Text = body };

                // Enviar
                await client.SendAsync(message);
                logger.LogInformation("Email enviado exitosamente");

                await client.DisconnectAsync(true);
                logger.LogInformation("Pipeline de email completado");
            }
            catch (MailKit.Security.AuthenticationException authEx)
            {
                logger.LogError(authEx, "La autenticación de Gmail falló. Verifica la contraseña de aplicación.");
                throw new InvalidOperationException($"La autenticación de Gmail falló: {authEx.Message}. Por favor, verifica la contraseña de aplicación.", authEx);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error al enviar el email");
                throw;
            }
            logger.LogInformation("Email processed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al enviar el email");

            // Verificar si usar fallback
            var useFallback = bool.Parse(smtpSettings["UseFallback"] ?? "false");
            if (useFallback)
            {
                logger.LogWarning("Usando respaldo de email");
                return; // No fallar, solo logear
            }

            throw new InvalidOperationException($"Error al enviar el email: {ex.Message}", ex);
        }
    }
}
