using System;

namespace AuthenticationService.Domain.Constants;

public class RoleConstants
{
    public const string USER_ROLE = "USER_ROLE";
    public const string PASSENGER_ROLE = "PASSENGER_ROLE";
    public const string DRIVER_ROLE = "DRIVER_ROLE";
    public const string ADMIN_ROLE = "ADMIN_ROLE";

    public static readonly string[] AllowedRoles = [USER_ROLE, PASSENGER_ROLE, DRIVER_ROLE, ADMIN_ROLE];
}
