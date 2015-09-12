var fillPassword=function(credentials){
  swal.close();
  $('input#signin-email').val(credentials.username);
  $('input#signin-password').val(credentials.password);
  $('.password-signin button.submit').trigger('click');
};

var openModal=function(){
  swal({
    title: "Video Capture",
    text: "<div id=\"web-cam\" style=\"width:100%;height:300px;\"></div>",
    html: true
  });
  Webcam.attach('#web-cam');
};

var startStream=function(audioOnly){
  openModal();

  if(audioOnly) {
    navigator.webkitGetUserMedia(
      {
        audio:true,
        video:true
      },
      function(stream){
        mediaRecorder.mimeType='audio/wav';

        var mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.ondataavailable = function (blob) {
          console.log(blob);
          chrome.runtime.sendMessage({data:blob}, function(response) {
            console.log(response);
            console.log('Response received!');
          });
          mediaRecorder.stop();
        };

        mediaRecorder.start(50000); // Start record
      },
      function(error){
        console.error(error);
      }
    );
  } else {
    setTimeout(function(){
    Webcam.snap(function(dataUri) {
      console.log(dataUri);
      chrome.runtime.sendMessage({data:dataUri}, fillPassword);
    });
    },3000);
  }
};

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  console.log(request);
});

startStream();
