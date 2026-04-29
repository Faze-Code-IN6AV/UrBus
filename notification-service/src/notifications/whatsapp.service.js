import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = pkg;

let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    //Para Windows
    //executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
    //Para Mac
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  }
});

export const getGroups = async () => {
  if (!client) throw new Error('WhatsApp client not initialized');
  if (!isReady) throw new Error('WhatsApp is not ready yet');

  const chats = await client.getChats();

  const groups = chats
    .filter(chat => chat.isGroup)
    .map(group => ({
      name: group.name,
      id: group.id._serialized
    }));

  return groups;
};

client.on('qr', qr => {
  console.log('Escanea el QR para conectar WhatsApp');
  qrcode.generate(qr, { small: true });
});

client.on('ready', async() => {
  console.log('WhatsApp listo');
  isReady = true; 
});

client.on('disconnected', () => {
  console.log('WhatsApp desconectado');
  isReady = false;
});

client.initialize();

const formatNumber = (number) => {
  if (!number) throw new Error('El numero es necesario');

  let cleanNumber = number.replace(/\D/g, '');

  if (!cleanNumber.startsWith('502')) {
    cleanNumber = `502${cleanNumber}`;
  }

  return `${cleanNumber}@c.us`;
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

    if (!cleanNumber.startsWith('502')) {
      cleanNumber = `502${cleanNumber}`;
    }

    chatId = `${cleanNumber}@c.us`;
  }

  console.log("Enviando mensaje a:", chatId);

  return await client.sendMessage(chatId, message);
};