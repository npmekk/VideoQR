function sendAPI() {
    console.log('123123');
    var videoname = new_file_name;
    var url = document.getElementById('url1').value;
    var token = azureuid;//cpp6z10cavht5PDMzzGkeJdtJaB2
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance http://52.237.127.46:5000/VQRaddAPI
    var theUrl = "http://52.237.127.46:5000/VQRaddAPI";
    //var theUrl = "http://127.0.0.1/VideoQR%20Final%20Version/VideoQR/UpdateStatusAPI";
    
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Access-Control-Allow-Headers", "*");
    xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
    xmlhttp.setRequestHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var payload = { vid_path: videoname , longlink: url , access_token: token }
    xmlhttp.send(JSON.stringify(payload));
    console.log(xmlhttp.responseText);
    JSON.stringify(payload)
    console.log(payload);
}