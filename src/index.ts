import express from 'express';

import { startCronJob } from './cronjobs/cronjob';
import WhatsappService from './service/whatsappService';
import utilites from './util/utilities';
import router from './routes/whatsappApiRoutes';

const app = express();
app.use(express.json());

app.use("/api", router)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startCronJob();
});
