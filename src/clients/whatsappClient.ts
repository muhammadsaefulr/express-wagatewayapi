import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import * as qrcode from "qrcode";
import * as path from "path";
import { NewMessage, MessageKey } from "../../types/global.types";
import utilites from "../util/utilities";

let sock: any;
let qrCodeData: any;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
  });

  sock.ev.process(async (events: any) => {
    if (events["connection.update"]) {
      const update = events["connection.update"];
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        console.log(
          "connection closed due to ",
          lastDisconnect.error,
          ", reconnecting ",
          shouldReconnect
        );
        // reconnect if not logged out
        if (shouldReconnect) {
          connectToWhatsApp();
        }
      } else if (connection === "open") {
        sock.sendMessage("6288219406742" + "@s.whatsapp.net", {
          text: `${sock?.user?.name || "Bot"} has Connected...`,
        });
      }

      if (update.qr) {
        qrCodeData = update.qr;

        const __dirname = path.resolve();
        const qrImagePath = path.join(
          __dirname,
          "qr-code",
          "latest-qrcode.png"
        );
        await qrcode.toFile(qrImagePath, qrCodeData);

        console.log("QR code received and saved as image:", qrImagePath);
      }
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", (m: any) => {
    const newMessages: NewMessage[] = m.messages.map(
      (msg: {
        key: { remoteJid: any; id: any; participant: any };
        message: any;
        messageTimestamp: any;
      }) => ({
        key: {
          remoteJid: msg.key.remoteJid,
          id: msg.key.id,
          participant: msg.key.participant,
        },
        message: msg.message,
        sender: msg.key.participant,
        timestamp: msg.messageTimestamp,
      })
    );

    console.log(JSON.stringify(m, undefined, 2));
    utilites.updateMessageSync(newMessages);
    (<any>process).send({ type: "new_messages", data: newMessages });
  });
}

process.on("message", async (msg: any) => {
  if (msg.type === "send") {
    const { jid, message } = msg.data;
    await sock.sendMessage(jid, { text: message });
  }
});

connectToWhatsApp().catch((err) => console.log("Unexpected error : " + err));
