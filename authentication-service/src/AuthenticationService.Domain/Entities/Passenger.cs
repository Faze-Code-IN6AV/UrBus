using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AuthenticationService.Domain.Entities;

public class Passenger
{
    [Key]
    [MaxLength(16)]
    public string Id {get; set;} = string.Empty;

    [Required(ErrorMessage = "El ID del usuario es obligatorio.")]
    [MaxLength(16)]
    public string UserId {get; set;} = string.Empty;

    [ForeignKey(nameof(UserId))]
    public User User {get; set;} = null!;

    [Required(ErrorMessage = "La ruta es obligatoria.")]
    [MaxLength(50)]
    public string AssignedRoute {get; set;} = string.Empty;

    [Required(ErrorMessage = "La unidad de bus es obligatoria.")]
    [MaxLength(50)]
    public string AssignedBus {get; set;} = string.Empty;

    public bool IsOnBoard {get; set;} = false;

    public DateTime? LastAttendanceDate {get; set;}

    public bool IsActive {get; set;} = true;
}
