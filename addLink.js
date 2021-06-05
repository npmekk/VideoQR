var theDiv = document.getElementById('addlink');
var _CANVAS = document.querySelector("#video-canvas"),
    _CTX = _CANVAS.getContext("2d"),
    _VIDEO = document.querySelector("#targetVideo");
    _CANVAS.crossOrigin="anonymous";

    

var addid = 0;
function addLink() {
  //GET VIDEO CURRENNT TIME16
  _CANVAS.width = _VIDEO.videoWidth/8;
  _CANVAS.height = _VIDEO.videoHeight/8;
  var aud = document.getElementById('targetVideo');
    console.log(aud.currentTime);
    
    var totalSeconds = Math.round(aud.currentTime);
    hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    minutes = Math.floor(totalSeconds / 60);
    seconds = totalSeconds % 60;
    minutes = String(minutes).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    var curr_time = hours+':'+minutes+':'+seconds;
  //THUMBNAIL
  _CTX.drawImage(_VIDEO, 0, 0, _VIDEO.videoWidth/8, _VIDEO.videoHeight/8);
  encodedImg = _CANVAS.toDataURL('image/jpeg');




    
  //ID THINGY
    var addList = document.getElementById('addlink');
    var docstyle = addList.style.display;
    if (docstyle == 'none') addList.style.display = '';
    addid++;
    var text = document.createElement('div');
    text.id = 'additem_' + addid;
    text.innerHTML = `<label>
                        <b id="show_url`+addid+`" style="padding-left: 15px"> URL `+addid+` </b> 
                      </label> 
                      <input type="url"  id="url`+addid+`"  placeholder="Your URL" required>
                      <label>
                        <b id="redirect`+addid+`" style="padding-left: 15px"> Redirect time `+addid+` </b> 
                      </label> 
                      <input type="text"  oninput="this.value = this.value.replace(/[^0-9 :]/g, \'\').replace(/(\..*?)\..*/g, "$1");" id="time`+addid+`" placeholder="HH:MM:SS " value="`+curr_time+`"/>
                     
                      <label>
                        <b id="thumbnail`+addid+`" style="padding-left: 15px"> Thumbnail `+addid+` </b> 
                      </label> 
                      <img id="img`+addid+`" style='height:120px;width:160px;padding-left: 15px' src="`+encodedImg+`">
                      <button type="button" id="remove`+addid+`" data-id="`+addid+`" class="btn btn-danger remove" style="margin-left: 15px">X</button>
    `;

    addList.appendChild(text);

  //ADD TO MODAL
    var validatelink = document.getElementById('validatelink');
    var docstyle = validatelink.style.display;
    if (docstyle == 'none') validatelink.style.display = '';
    var text = document.createElement('div');
    text.id = 'additem_' + addid;
    text.innerHTML = `<label>
                        <b id="show_url`+addid+`" style="padding-left: 15px"> URL `+addid+` </b> 
                      </label> 
                      <input disabled type="url"  id="va_url`+addid+`"  placeholder="Your URL" required>
                      <label>
                        <b id="redirect`+addid+`" style="padding-left: 15px"> Redirect time `+addid+` </b> 
                      </label> 
                      <input disabled type="text"  oninput="this.value = this.value.replace(/[^0-9 :]/g, \'\').replace(/(\..*?)\..*/g, "$1");" id="time`+addid+`" placeholder="HH:MM:SS " value="`+curr_time+`"/>
                    
                      <label>
                        <b id="thumbnail`+addid+`" style="padding-left: 15px"> Thumbnail `+addid+` </b> 
                      </label> 
                      <img id="img`+addid+`" style='height:120px;width:160px;padding-left: 15px' src="`+encodedImg+`">
    `;

    validatelink.appendChild(text);

}

$(document).on('click',`.remove`,function(){
  //alert('test');
  
  $('#additem_' + $(this).data('id')).remove();
  //DEL MODAL
  $('#additem_' + $(this).data('id')).remove();
  for(i = $(this).data('id');i <= addid;i++)
  {
    newid = i - 1;
    $('#additem_'+i).attr('id','additem_'+newid);
    $('#remove'+i).attr('data-id',newid);
    $('#remove'+i).attr('id',"remove"+newid);
    $('#show_url'+i).text(' URL '+newid);
    $('#show_url'+i).attr('id',"show_url"+newid);
    $('#url'+i).attr('id',"url"+newid);
    $('#redirect'+i).text(' Redirect time '+newid);
    $('#redirect'+i).attr('id','redirect'+newid);
    $('#thumbnail'+i).text(' Thumbnail '+newid);
    $('#thumbnail'+i).attr('id','thumbnail'+newid);
    $('#img'+i).attr('id','img'+newid);
    $('#time'+i).attr('id',"time"+newid);
    //RE-AGAIN FOR MODAL SECTION
    $('#additem_'+i).attr('id','additem_'+newid);
    $('#show_url'+i).text(' URL '+newid);
    $('#show_url'+i).attr('id',"show_url"+newid);
    $('#va_url'+i).attr('id',"va_url"+newid);
    $('#redirect'+i).text(' Redirect time '+newid);
    $('#redirect'+i).attr('id','redirect'+newid);
    $('#thumbnail'+i).text(' Thumbnail '+newid);
    $('#thumbnail'+i).attr('id','thumbnail'+newid);
    $('#img'+i).attr('id','img'+newid);
    $('#time'+i).attr('id',"time"+newid);
  }
  
  addid-=1;
  
  //$(`#url${addid}`).val("Dolly Duck");
});

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
//CHANGE MODAL URL
btn.onclick = function() {
  modal.style.display = "block";
  for(i = 1;i <= addid;i++)
  {
    $('#va_url'+i).val($('#url'+i).val());
  }
}
window.onclick = function(event) {
  if (event.target == modal) {
    
    modal.style.display = "none";
  }
}
$(document).keydown(function(event) { 
  if (event.keyCode == 27) { 
    $('#myModal').hide();
  }
});