

// document.getElementById("sendMessage").addEventListener("click", sendWaMessage());

function sendWaMessage() {
    const phoneNo = document.getElementById("phoneNo");
    const msgText = document.getElementById("mesgText");
    const txtAreaRespuesta = document.getElementById("respuestaEnvio");

    var msgbody = {
        phoneNo: phoneNo.value,
        msgText: msgText.value
    }

    console.log(msgbody);
    var options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msgbody)
    }

    fetch("http://localhost:3000/send-message", options)
    .then( response =>  response.json())
    .then( (msgResponse) => {
        const {success, error, result} = msgResponse;
        console.log(msgResponse);
        console.log(error);
        if (success){
            window.alert("mensaje enviado con exito");
            txtAreaRespuesta.value = result;

        } 
    })
    .catch( (error) => {
        console.error(error);
    });
}