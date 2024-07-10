export interface MessageKey {
    remoteJid: string;
    id: string;
    participant?: string;
    messageTimestamp: number;
}

export interface NewMessage {
    key: MessageKey;
    message: any; // Anda bisa mengganti `any` dengan tipe yang lebih spesifik jika tahu strukturnya
    sender?: string;
    timestamp: number;
}