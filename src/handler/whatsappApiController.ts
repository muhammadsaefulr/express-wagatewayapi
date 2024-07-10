import { NextFunction, Request, Response } from "express";
import WhatsappService from "../service/whatsappService";
import utilites from "../util/utilities";

class whatsappControllerApi {
    static async startClients (req: Request, res: Response, next: NextFunction){
        try {
            WhatsappService.startWhatsAppClient();
            res.json({data: { message: "Memulai klien whatsapp, 5min estimated..."}});
        } catch (error) {
            next(error)
        }
    }

    static async getAllMsg (res: Response){
        try {
            const dataAllMsg = utilites.readMessagesFromFile()
            res.status(200).json(dataAllMsg);
        } catch (e){

        }
    }

    static async sendMsg (res: Response, req: Request){
        const { jid, message } = req.body;
        try {
            WhatsappService.sendMessage(jid, message);
            res.status(200).json({data: {message: message, toNumber: jid}});
        } catch (error) {
            res.status(500).send(`Failed to send message: ${error}`);
        }
    }
}

export default whatsappControllerApi