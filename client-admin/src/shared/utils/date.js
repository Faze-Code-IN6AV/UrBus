// Devuelve true si la fecha dada cae en el mismo día calendario de hoy, en horario de Guatemala.
// Se usa para que cosas como el motivo de ausencia desaparezcan automáticamente a las 0:00 (GMT-6).
export const isTodayGT = (value) => {
    if (!value) return false;
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return false;

    const fmt = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guatemala' }).format(d);
    return fmt(date) === fmt(new Date());
};
// Formatea una fecha (ISO string, Date, etc.) al horario de Guatemala (UTC-6, sin horario de verano).
// Devuelve algo como: "21 jul 2026, 03:45 p. m."
export const formatDateGT = (value) => {
    if (!value) return 'No disponible';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'No disponible';

    const formatted = new Intl.DateTimeFormat('es-GT', {
        timeZone: 'America/Guatemala',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    }).format(date);

    return `${formatted} (GMT-6)`;
};
