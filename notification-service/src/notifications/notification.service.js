import { sendMessage, getGroups } from './whatsapp.service.js';

export const listGroups = async () => {
  return await getGroups();
};

export const notifyArrival = (number, busName) => {
  const message = `El bus ${busName} está por llegar.`;
  return sendMessage(number, message);
};

export const notifyDelay = (number, busName, minutes) => {
  const message = `El bus ${busName} tiene ${minutes} minutos de atraso.`;
  return sendMessage(number, message);
};

export const notifyRouteChange = (number, busName) => {
  const message = ` El bus ${busName} ha cambiado su ruta.`;
  return sendMessage(number, message);
};

export const notifyCustom = (number, message) => {
  return sendMessage(number, message);
};
