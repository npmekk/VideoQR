const input = document.getElementById('file-input');
    const video = document.getElementById('targetVideo');
    const videoSource = document.createElement('source');

    input.addEventListener('change', function() {
        const files = this.files || [];

        if (!files.length) return;
        
        const reader = new FileReader();

        reader.onload = function (e) {
            videoSource.setAttribute('src', e.target.result);
            video.appendChild(videoSource);
            video.load();
            video.play();
        };
    
        reader.onprogress = function (e) {
        console.log('progress: ', Math.round((e.loaded * 100) / e.total));
        };
    
        reader.readAsDataURL(files[0]);
    });
    var myVideos = [];

    window.URL = window.URL || window.webkitURL;

    document.getElementById('file-input').onchange = setFileInfo;

    function setFileInfo() {
        var files = this.files;
        myVideos.push(files[0]);
        var video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function() {
            window.URL.revokeObjectURL(video.src);
            var duration = video.duration;
            myVideos[myVideos.length - 1].duration = duration;
            updateInfos();
            }

        video.src = URL.createObjectURL(files[0]);;
    }

    function updateInfos() {
    var infos = document.getElementById('infos');
    infos.textContent = "";
    for (var i = 0; i < myVideos.length; i++) {
        infos.textContent +=  myVideos[i].duration;
    }
}
