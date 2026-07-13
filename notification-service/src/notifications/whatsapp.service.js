import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import { existsSync } from 'fs';

const { Client, LocalAuth } = pkg;

let isReady = false;
let currentQR = null;
let client = null;

// Rutas comunes de Chrome/Chromium por sistema operativo.
// Se usa la primera que exista en el equipo donde corra el servicio.
const CHROME_PATHS_BY_PLATFORM = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ],
};

const resolveChromeExecutablePath = () => {
  // 1. Permitir override explícito por variable de entorno (recomendado en Docker/CI)
  const envPath = process.env.CHROME_EXECUTABLE_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  if (envPath && existsSync(envPath)) return envPath;

  // 2. Autodetección según el sistema operativo actual
  const candidates = CHROME_PATHS_BY_PLATFORM[process.platform] || [];
  const found = candidates.find((path) => existsSync(path));

  if (!found) {
    console.warn(
      `WhatsApp | No se encontró Chrome/Chromium instalado para la plataforma "${process.platform}". ` +
      'Define la variable de entorno CHROME_EXECUTABLE_PATH apuntando a tu ejecutable de Chrome o Chromium.'
    );
  }

  return found;
};

const createClient = () => {
  const executablePath = resolveChromeExecutablePath();

  const c = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      ...(executablePath ? { executablePath } : {}),
    }
  });

  c.on('qr', qr => {
    console.log('Escanea el QR para conectar WhatsApp');
    qrcode.generate(qr, { small: true });
    currentQR = qr;
    isReady = false;
  });

  c.on('ready', () => {
    console.log('WhatsApp listo');
    isReady = true;
    currentQR = null;
  });

  c.on('disconnected', (reason) => {
    console.log('WhatsApp desconectado, razón:', reason);
    isReady = false;
    currentQR = null;

    // Destruir en background sin await — el browser ya puede estar cerrado
    try { c.destroy().catch(() => {}); } catch (_) {}

    console.log('Reiniciando cliente WhatsApp en 5s...');
    setTimeout(() => {
      client = createClient();
      client.initialize().catch(err => {
        console.error('Error al reinicializar WhatsApp:', err.message);
      });
    }, 5000);
  });

  return c;
};

// Evitar que errores de puppeteer/whatsapp maten el proceso entero
process.on('unhandledRejection', (reason) => {
  const msg = reason?.message || String(reason);
  const isExpected = msg.includes('Target closed') || msg.includes('Execution context was destroyed') || msg.includes('Protocol error');
  if (isExpected) {
    console.warn('WhatsApp error ignorado (reconexión en curso):', msg);
  } else {
    console.error('UnhandledRejection:', msg);
  }
});

client = createClient();
client.initialize().catch(err => {
  console.error('Error al inicializar WhatsApp:', err.message);
});

export const getStatus = () => ({ isReady, hasQR: !!currentQR });

export const getQRImage = async () => {
  if (!currentQR) return null;
  return await QRCode.toDataURL(currentQR, { width: 256, margin: 2 });
};

export const getGroups = async () => {
  if (!client) throw new Error('WhatsApp client not initialized');
  if (!isReady) throw new Error('WhatsApp is not ready yet');
  const chats = await client.getChats();
  return chats
    .filter(chat => chat.isGroup)
    .map(group => ({ name: group.name, id: group.id._serialized }));
};

export const sendMessage = async (number, message) => {
  if (!client) throw new Error('WhatsApp client not initialized');
  if (!isReady) throw new Error('WhatsApp is not ready yet');
  if (!number) throw new Error('El numero es requerido');

  let chatId;
  if (number.endsWith('@g.us')) {
    chatId = number;
  } else {
    let cleanNumber = number.replace(/\D/g, '');
    if (!cleanNumber.startsWith('502')) cleanNumber = `502${cleanNumber}`;
    chatId = `${cleanNumber}@c.us`;
  }

  console.log('Enviando mensaje a:', chatId);
  return await client.sendMessage(chatId, message);
};