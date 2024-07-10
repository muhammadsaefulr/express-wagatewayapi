import { fork, ChildProcess } from "child_process";
import path from "path";
import utilites from "../util/utilities";

let whatsappClient: ChildProcess | null = null;

class WhatsappService {

  static startWhatsAppClient() {
    if (!whatsappClient || whatsappClient.killed) {
      whatsappClient = fork(path.resolve(__dirname, "../clients/whatsappClient.ts"));

      whatsappClient.on("message", (msg) => {
        console.log("Message from WhatsApp client:", msg);
      });

      whatsappClient.on("exit", (code, signal) => {
        console.log(
          `WhatsApp client exited with code ${code} and signal ${signal}`
        );
        // Reconnect the client if it exits unexpectedly
        if (code !== 0) {
          WhatsappService.startWhatsAppClient();
        }
      });
    }
  }

  static handleClientMessages(msg: any) {
    if (msg.type === 'restart') {
        console.log('Restarting WhatsApp client due to stream error...');
        WhatsappService.startWhatsAppClient();
    } else if (msg.type === 'new_messages') {
       utilites.saveMessagesToFile(msg.data)
    }
}

  static sendMessage(jid: string, message: string) {
    if (!whatsappClient) throw new Error("WhatsApp client is not running");
    whatsappClient.send({ type: "send", data: { jid, message } });
  }
}

export default WhatsappService
