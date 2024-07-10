import * as fs from "fs"
import { NewMessage } from "../../types/global.types";


class utilites {
    static saveMessagesToFile = async (messages: NewMessage[]) => {

        fs.writeFile('allMessages.json', JSON.stringify(messages, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file', err);
            } else {
                console.log('Messages saved to allMessages.json');
            }
        });
    };

    static updateMessageSync = (messages: NewMessage[])=> {
        const existingMsg = this.readMessagesFromFile();
        const dataMsg = existingMsg.concat(messages)
        this.saveMessagesToFile(dataMsg);
    }

    static readMessagesFromFile = (): NewMessage[] => {
        try {
            const data = fs.readFileSync('allMessages.json', 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Error reading file', err);
            return [];
        }
    };
    
}

export default utilites