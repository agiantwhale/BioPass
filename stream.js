var fillPassword=function(credentials,siteInfo){
  if(credentials.auth) {
    Webcam.reset();
    siteInfo.loginInput.val(credentials.username);
    siteInfo.passwordInput.val(credentials.password);
    swal({
      title:"Success!",
      text:"Welcome back! Logging you in.",
      type:"success",
      showConfirmButton:false
    });
    setTimeout(function(){
      swal.close();
      siteInfo.loginButton.trigger('click');
    },1500);
  } else {
    setTimeout(checkStream,150);
  }
};

var openModal=function(){
  swal({
    title: "Who is there?",
    text: "<div id=\"web-cam\" style=\"width:100%;height:300px;\"></div>",
    html: true,
    showConfirmButton:false
  });
  Webcam.attach('#web-cam');
};

var checkStream=function(audioOnly){
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
        chrome.runtime.sendMessage({data:dataUri}, function(cred){
          fillPassword(cred,siteInfo);
        });
      });
    },3000);
  }
};

var siteInfo=siteinfo();
console.log(siteInfo);
if(siteInfo.loginScreen){
  openModal();
  checkStream();
}
