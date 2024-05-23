
document.addEventListener("DOMContentLoaded", function() {
    // console.log("Ingreso al dom cargado");
    // code...
    qrUpdate();
});



function qrUpdate(){
    setInterval( async () => {
        await fetch("http://localhost:3000/qrcode", 
        {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            // mode: "no-cors", // no-cors, *cors, same-origin
            // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            // headers: {
            // "Content-Type": "application/json",
            // // 'Content-Type': 'application/x-www-form-urlencoded',
            // },
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify({}), // body data type must match "Content-Type" header
        })
        .then( response =>  response.json())
        // .then( result => console.log(result))
        // .catch(error => console.log('error', error));
        .then( (qrcode) => {
            // console.log(qrcode);
            const {success, qrCodeUrl, error, isConnected} = qrcode;
            console.log(error);
            if (success){
                document.getElementById("qr-code").setAttribute("src", qrCodeUrl);
            } 
            if (isConnected){
                window.location.href= './chats.html';
            }
        })
        .catch( (error) => {
            console.error(error);
        });
    }, 5000);
}






