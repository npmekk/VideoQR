
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
  
    const dropZoneElement = inputElement.closest(".drop-zone");
  
    dropZoneElement.addEventListener("click", (e) => {
      inputElement.click();
    });
  
    inputElement.addEventListener("change", (e) => {
      if (inputElement.files.length) {
        updateThumbnail(dropZoneElement, inputElement.files[0]);
        var x = document.getElementById("info");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
            
            var x = document.getElementById("myDIV");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
            var x = document.getElementById("upload");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
      }
    });
  
    dropZoneElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZoneElement.classList.add("drop-zone--over");
    });
  
    ["dragleave", "dragend"].forEach((type) => {
      dropZoneElement.addEventListener(type, (e) => {
        dropZoneElement.classList.remove("drop-zone--over");
      });
    });
  
    dropZoneElement.addEventListener("drop", (e) => {
      e.preventDefault();
      
      
  
      if (e.dataTransfer.files.length) {
        inputElement.files = e.dataTransfer.files;
                          
                          const video = document.getElementById('targetVideo');
                          const videoSource = document.createElement('source');

                          const files = inputElement.files || [];

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
                          uploadFiles;
                          function updateInfos() {
                            var infos = document.getElementById('infos');
                            infos.textContent = "";
                            for (var i = 0; i < myVideos.length; i++) {
                                infos.textContent +=  myVideos[i].duration;
                            }
                            
                          }
                          var filename = inputElement.files[0].name;
                          /* var lastIndex = filename.lastIndexOf("\\");
                          if (lastIndex >= 0) {
                              filename = filename.substring(lastIndex + 1);
                          } */
                          document.getElementById('fn').value = filename;
                          var filesize = inputElement.files[0].size;
                          document.getElementById('fs').value = filesize;
                          //return filename;
                          
                          var x = document.getElementById('fn');
                          console.log(x);
                          var y = document.getElementById('fs');
                          console.log(y);
                          
        var x = document.getElementById("info");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
          var x = document.getElementById("myDIV");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
            var x = document.getElementById("upload");
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
            
           
      }
  
      dropZoneElement.classList.remove("drop-zone--over");
    });
  });
  
  /**
   * Updates the thumbnail on a drop zone element.
   *
   * @param {HTMLElement} dropZoneElement
   * @param {File} file
   */
  function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");
  
    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
      dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }
  
    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
      thumbnailElement = document.createElement("div");
      thumbnailElement.classList.add("drop-zone__thumb");
      dropZoneElement.appendChild(thumbnailElement);
    }
  
    thumbnailElement.dataset.label = file.name;
  
    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
  
      reader.readAsDataURL(file);
      reader.onload = () => {
        thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      };
    } else {
      thumbnailElement.style.backgroundImage = null;
    }
  }
  