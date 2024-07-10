import cron from 'node-cron';
import WhatsappService from '../service/whatsappService';

export function startCronJob() {
    cron.schedule('*/5 * * * *', () => {
        console.log('Checking WhatsApp client connection...');
        WhatsappService.startWhatsAppClient();
    });
}
