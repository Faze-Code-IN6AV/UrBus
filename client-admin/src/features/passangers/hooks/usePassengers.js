import { useState, useEffect, useCallback } from 'react';
import { getPassengers, updatePassengerStatus, deletePassenger } from '../../../shared/api/passenger.js';
import { showError } from '../../../shared/utils/toast.js';

export const usePassengers = () => {
    const [passengers, setPassengers] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);

    const fetchPassengers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await getPassengers();
            setPassengers(data ?? []);
        } catch (err) {
            const msg = err.response?.data?.message || 'Error al cargar pasajeros';
            setError(msg);
            showError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPassengers();
    }, [fetchPassengers]);

    const toggleStatus = useCallback(async (id, currentStatus) => {
        const newStatus = currentStatus === 'PRESENT' ? 'AUSENT' : 'PRESENT';
        setPassengers((prev) =>
            prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
        try {
            await updatePassengerStatus(id, newStatus);
        } catch (err) {
            // Revert on error
            setPassengers((prev) =>
                prev.map((p) => (p._id === id ? { ...p, status: currentStatus } : p))
            );
            showError(err.response?.data?.message || 'Error al actualizar estado');
        }
    }, []);

    const removePassenger = useCallback(async (id) => {
        const prev = [...passengers];
        setPassengers((list) => list.filter((p) => p._id !== id));
        try {
            await deletePassenger(id);
        } catch (err) {
            setPassengers(prev);
            showError(err.response?.data?.message || 'Error al eliminar pasajero');
        }
    }, [passengers]);

    return { passengers, loading, error, refetch: fetchPassengers, toggleStatus, removePassenger };
};