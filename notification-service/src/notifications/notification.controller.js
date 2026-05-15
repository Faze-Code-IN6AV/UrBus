import {
  notifyArrival,
  notifyDelay,
  notifyRouteChange,
  notifyCustom,
  listGroups
} from './notification.service.js';
import { getStatus, getQRImage } from './whatsapp.service.js';

const isGroup = (number) => {
  return typeof number === 'string' && number.endsWith('@g.us');
};

const validateNumber = (number) => {
  if (!number) return false;
  return typeof number === 'string' && number.trim().length > 0;
};

const isAdmin = (req) => {
  const role =
    req.user?.role ||
    req.user?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

  return role === 'ADMIN_ROLE' || role === 'DRIVER_ROLE';
};

export const sendArrival = async (req, res) => {
  try {
    const { number, busName } = req.body;

    if (!validateNumber(number) || !busName) {
      return res.status(400).json({
        success: false,
        message: 'El número y el nombre del autobús son obligatorios'
      });
    }

    if (isGroup(number) && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores y conductores pueden enviar mensajes a grupos'
      });
    }

    await notifyArrival(number, busName);

    res.status(200).json({
      success: true,
      message: 'Notificación de llegada enviada'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendDelay = async (req, res) => {
  try {
    const { number, busName, minutes } = req.body;

    if (!validateNumber(number) || !busName || !minutes) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren número, nombre del bus y minutos'
      });
    }

    if (isGroup(number) && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores y conductores pueden enviar mensajes a grupos'
      });
    }

    await notifyDelay(number, busName, minutes);

    res.status(200).json({
      success: true,
      message: 'Notificación de retraso enviada'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendRouteChange = async (req, res) => {
  try {
    const { number, busName } = req.body;

    if (!validateNumber(number) || !busName) {
      return res.status(400).json({
        success: false,
        message: 'El número y el nombre del autobús son obligatorios'
      });
    }

    if (isGroup(number) && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores y conductores pueden enviar mensajes a grupos'
      });
    }

    await notifyRouteChange(number, busName);

    res.status(200).json({
      success: true,
      message: 'Notificación de cambio de ruta enviada'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendCustom = async (req, res) => {
  try {
    const { number, message } = req.body;

    if (!validateNumber(number) || !message) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren número y mensaje'
      });
    }

    if (isGroup(number) && !isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores y conductores pueden enviar mensajes a grupos'
      });
    }

    await notifyCustom(number, message);

    res.status(200).json({
      success: true,
      message: 'Notificación personalizada enviada'
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWhatsAppGroups = async (req, res) => {
  try {

    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso solo para administradores y conductores'
      });
    }

    const groups = await listGroups();

    res.status(200).json({
      success: true,
      groups
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getWhatsAppStatus = (req, res) => {
  try {
    const status = getStatus();
    res.status(200).json({ success: true, ...status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWhatsAppQR = async (req, res) => {
  try {
    const { isReady } = getStatus();

    if (isReady) {
      return res.status(200).json({ success: true, isReady: true, qr: null });
    }

    const qr = await getQRImage();

    if (!qr) {
      return res.status(200).json({ success: true, isReady: false, qr: null, message: 'QR aún no generado, espera unos segundos' });
    }

    res.status(200).json({ success: true, isReady: false, qr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};