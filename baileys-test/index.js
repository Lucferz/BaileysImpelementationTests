const express = require('express');
const WhatsappApi = require('./WhatsappApi');
const qrcode = require('qrcode');
const bodyParser = require('body-parser');
const cors = require('cors');

const whaApi = new WhatsappApi();
whaApi.initialize();
const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.type('text/plain');
    // res.send('Server Expresso ☕');
    // whaApi.initialize();
    // const qrCodeText = whaApi.getQrCode();
    res.send("Activo");
    

});


app.post('/send-message', async (req, res) => {
    console.log(req.body);
    const {phoneNo, msgText } = req.body;
    whaApi.sendTextMessage(phoneNo, msgText)
    .then( result => res.status(200).send({
        success: true,
        response: result
    }))
    .catch( (err) => {
        console.error(err);
        res.status(500).send({
            success:false,
            error: err
        });
    });
});

// app.post('/qrcode',  async (req, res) => {
//     console.log("Entro en la peticion del qr code");
//     const qrUrl = await whaApi.getQrCode();
//     // console.log(qrUrl);
//     res.status(200).send({
//         succes:true,
//         qrCodeUrl: qrUrl
//     });
// });

app.post('/qrcode',  async (req, res) => {
    // console.log("Entro en la peticion del qr code");
    const qrCodeResponse =  whaApi.getQrCode();
    // console.log(qrCode);
    if (qrCodeResponse.success){
        const {qrCode} = qrCodeResponse;
        qrcode.toDataURL(qrCode, (err, url) => {
            if (err) {
                res.status(500).send({
                    success:false,
                    error: 'Error generating QR code'
                });
            } else {
                res.status(200).send({
                    success:true,
                    qrCodeUrl: url
                });
            }
        });
    } else {
        const {error} = qrCodeResponse;
        const {isConnected} = qrCodeResponse;
        if (error) {
            res.status(404).send({
                success:false,
                error: error
            });
        }

        if (isConnected){
            res.status(200).send({
                success:false,
                isConnected:true
            });
        }
    }
});


app.get('/about', (req, res) => {
    res.type('text/plain');
    res.send('Server Expresso ☕ About');
});


app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 Not found ☕_☕');
});

// app.listen(port, () => console.log(`Expresso ☕ is on Port ${port} Ctrl + C to Stop `));
app.listen(port);