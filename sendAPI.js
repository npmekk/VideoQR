function sendAPI() {
    var videoname = document.getElementById('fn').value;
    var url = document.getElementById('url1').value;
    var token = azureuid;//cpp6z10cavht5PDMzzGkeJdtJaB2
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance http://52.237.127.46:5000/VQRaddA
    var theUrl = "http://52.237.127.46:5000/VQRaddA";
    //xmlhttp.open("POST", theUrl);
    //xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var payload = { vid_path: videoname , longlink: url , access_token: token }
    //xmlhttp.send(JSON.stringify(payload));
    JSON.stringify(payload)
    console.log(payload);
}