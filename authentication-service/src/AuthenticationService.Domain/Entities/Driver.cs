using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthenticationService.Domain.Entities;

public class Driver
{
    [Key]
    [MaxLength(16)]
    public string Id {get; set;} = string.Empty;

    [Required(ErrorMessage = "El ID del usuario es obligatorio.")]
    [MaxLength(16)]
    public string UserId {get; set;} = string.Empty;

    [ForeignKey(nameof(UserId))]
    public User User {get; set;} = null!;

    [Required(ErrorMessage = "El número de licencia es obligatorio.")]
    [MaxLength(30)]
    public string LicenceNumber {get; set;} = string.Empty;

    [Required(ErrorMessage = "La ruta asignada es obligatoria.")]
    [MaxLength(50)]
    public string AssignedRoute {get; set;} = string.Empty;

    public bool IsActive {get; set;} = true;

    public DateTime? LastDepartureTime {get; set;}
    public DateTime? LasArrivalTime {get; set;}

    public DateTime CreatedAt {get; set;} = DateTime.UtcNow;
    public DateTime UpdatedAt {get; set;} = DateTime.UtcNow;
}
