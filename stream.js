function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}

var openModal=function(){
  swal({
    title: "Video Capture",
    text: "<video id=\"web-cam\" style=\"width:100%\" autoplay></video><canvas id=\"web-cam-canvas\" style=\"display:none;\"></canvas>",
    html: true
  });
};

var startStream=function(audioOnly){
  navigator.webkitGetUserMedia(
    {
      audio:true,
      video:true
    },
    function(stream){
      openModal();

      var video = document.querySelector('video#web-cam');
      video.src = window.URL.createObjectURL(stream);

      var mediaRecorder = new MediaStreamRecorder(stream);
      mediaRecorder.ondataavailable = function (blob) {
        console.log(blob);
        chrome.runtime.sendMessage({data:blob}, function(response) {
          console.log('Response received!');
        });
        mediaRecorder.stop();
      };

      if(audioOnly){
        mediaRecorder.mimeType='audio/wav';
        mediaRecorder.start(50000); // Start record
      } else {
        var canvas = document.querySelector('canvas#web-cam-canvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        var blob=dataURItoBlob(canvas.toDataURL('image/jpeg'));
        chrome.runtime.sendMessage({data:blob}, function(response) {
          console.log('Response received!');
        });
      }

    },
    function(error){
      console.error(error);
    }
  );
};
