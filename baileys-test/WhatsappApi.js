const { DisconnectReason, useMultiFileAuthState, MessageType, MessageOptions, Mimetype, Browsers } = require("@whiskeysockets/baileys");
const qrcode = require('qrcode');
const fs = require('node:fs');
// import { DisconnectReason, useMultiFileAuthState, MessageType, MessageOptions, Mimetype, Browsers } from "@whiskeysockets/baileys";


class WhatsappApi {

    makeWASocket = require("@whiskeysockets/baileys").default;

    id = null;
    state = null;
    qr = null;
    saveCreds = null;
    sock = null;
    isConnected = false;

    constructor() { }

    async initialize(){
        let auth = await useMultiFileAuthState('auth_info_baileys');
        this.state = auth.state;
        this.saveCreds = auth.saveCreds;
        this.sock = this.makeWASocket({
            // can provide additional config here
            // printQRInTerminal: true,
            auth:this.state,
        });
        this.connectionLogic();
    }

    getQrCode(){
        if (this.qr && !this.isConnected){
            return {
                success:true,
                qrCode: this.qr
            };
        } else if (this.isConnected) {
            return {
                success: false,
                isConnected: true
            };
        } else {
            return {
                success:false,
                error: "Qr no encontrado"
            };
        }
    }
    
    // sendTextMessage (id, message) {
    //     if (message == 'Hola'){
    //         await this.sock.sendMessage(id, { text: 'Hola que tal?' });
    //     } else if ( message == 'Bien y vos?'){
    //         await this.sock.sendMessage(id, { text: 'Bien tambien' });
    //     }
    // }

    sendTextMessage (phoneNo, message) {
        let id = phoneNo + "@s.whatsapp.net";
        return this.sock.sendMessage(id, { text: message});
    }
    
    
   
    connectionLogic() {
    
        this.sock.ev.on('connection.update', async (update) => {
            const {connection, lastDisconnect} = update;
            this.qr = update.qr;
            if (this.qr){
                // console.log("el qr va abajo");
                // console.log(this.qr);
            }
    
            if (connection == 'close'){
                const isLoggedOut = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                const isConnectionLost = lastDisconnect?.error?.output?.statusCode === DisconnectReason.connectionLost;

                // const shouldRecconect = isConnectionLost || isLoggedOut;
                console.log("status code: " + lastDisconnect?.error?.output?.statusCode);
                const shouldRecconect = isLoggedOut;
                console.log(isConnectionLost);
                if (!isConnectionLost){
                    console.log(isLoggedOut);
                    if (shouldRecconect) {
                        console.log("lastDisconnect: " + JSON.stringify(lastDisconnect));
                        this.initialize();
                        // if (lastDisconnect?.error?.message === 'stream errored out') {
                            // this.sock = this.makeWASocket({
                            //     // can provide additional config here
                            //     printQRInTerminal: true,
                            //     auth:this.state,
                            // });
                        // } else {
                        //     this.connectionLogic();
                        // }
                    } else {
                        // TODO: Borrar carepta auth_info_baileys para que no intente reconectar
                        fs.rm('./auth_info_baileys/', { recursive: true, force: true }, err => {
                            if (err) {
                              throw err;
                            }
                          });
                    }
                } else{
                    console.log("la conexion estaba cerrada, aguardando 5 segundos para reconexion");
                    // setInterval(() => {
                    //     console.log("intentando nuevamente");
                    //     this.initialize();
                    // }, 5000);
                    await this.sleepMs(5000);
                    console.log("intentando nuevamente");
                    this.initialize();
                }
            }
        });
    
        this.sock.ev.on('creds.update', this.saveCreds);
    
        this.sock.ev.on("messages.update", (messageInfo) => {
            this.isConnected = true;
            console.log("\nLog from update: " + JSON.stringify(messageInfo) + "\n");
        });
    
    
        // sock.ev.on("messages.upsert", (messageInfoUpsert) => {
        //     console.log("\nLog from upsert: " + JSON.stringify(messageInfoUpsert)+ "\n");
    
        //     id = messageInfoUpsert?.messages[0]?.key?.remoteJid;
        //     const fromMe = messageInfoUpsert?.messages[0]?.key?.fromMe;
        //     const mensajeRecibido = messageInfoUpsert?.messages[0]?.message;
        //     if (!fromMe) {
        //         ifconnectionLogic() ( mensajeRecibido != null){
        //             const mensajePersona = mensajeRecibido?.conversation;
        //             const mensajeEmpresa = mensajeRecibido?.extendedTextMessage?.text;
        //             if ( mensajeEmpresa != null ){
        //                 // sock.sendMessage(id, { text: 'Hola, que tal?' });
        //                 sendTextMessage(sock, id, mensajeEmpresa);
        //             } else if (mensajePersona != null ) {
        //                 // sock.sendMessage(id, { text: 'Muy interesante, pero no recuerdo haberte preguntado' });
        //                 sendTextMessage(sock, id, mensajePersona);
        //             }
        //         }
        //     }
    
        // });
    
        // phoneNumber = "595973182003";
        // id = phoneNumber + "@s.whatsapp.net";
        // sendTextMessage(sock, id, "Pedro ...");
    
    }

    sleepMs(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports  = WhatsappApi;