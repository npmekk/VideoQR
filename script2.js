document.getElementById('file-input').onchange = genNameSize;

function genNameSize() {
    var filename = this.value;
    
    var lastIndex = filename.lastIndexOf("\\");
    if (lastIndex >= 0) {
        filename = filename.substring(lastIndex + 1);
    }
    document.getElementById('fn').value = filename;
    var filesize = this.files[0].size;
    document.getElementById('fs').value = filesize;
    //return filename;
}

var x = document.getElementById('fn');
var y = document.getElementById('fs');

x.style.display = "none";
y.style.display = "none";