import express from "express";
import whatsappControllerApi from "../handler/whatsappApiController";
const router = express.Router()

router.post("/clienton", whatsappControllerApi.startClients)
router.get("/getallmsg", whatsappControllerApi.getAllMsg)
router.post("/sendmsg", whatsappControllerApi.sendMsg)

export default router