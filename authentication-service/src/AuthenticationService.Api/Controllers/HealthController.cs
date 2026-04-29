using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/health")]
[Tags("Health")]
public class HealthController : ControllerBase
{
    /// <summary>Estado del servicio</summary>
    [HttpGet]
    [ProducesResponseType(200)]
    public IActionResult GetHealth()
    {
        var response = new
        {
            status = "Healthy",
            timestamp = DateTime.UtcNow,
            service = "UrBus AuthService"
        };

        return Ok(response);
    }
}