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
      siteInfo.loginButton.trigger('click');
    },1500);
  } else {
    Webcam.reset();
    swal({
      title:"Error!",
      text:"Uh oh! You don't belong here.",
      type:"error",
      closeOnConfirm:false,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Try again?"
    },function(){
      openModal();
      checkStream();
    });
  }
};

var openModal=function(){
  swal({
    title: "Who's there?",
    text: "<div id=\"web-cam\" style=\"width:478px;height:365px;\"></div>",
    type: "warning",
    html: true,
    showConfirmButton:false
  });
};

var openModalMic=function(){
  swal({
    title: "Speak: 'Never forget tomorrow is a new day'",
	imageUrl: 'http://i.giphy.com/qh7g29Po61lW8.gif',
	imageSize: "200x200",
    html: true,
    showConfirmButton:true
  });
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
        chrome.runtime.sendMessage({data:dataUri}, function(cred){
          fillPassword(cred,siteInfo);
        });
      });
    },3000);
  }
};

var startRecorder = function(recorder) {
	recorder.clear();
	console.log('recording in session');
	recorder.record();
}

var finishRecorder = function(recorder) {
	recorder.stop();
	console.log('finished recording');

   recorder.exportWAV(function(wav) {
	   //save wav somewhere
    });
}

var recordAudio = function() {
	var audioContext = new AudioContext();
	console.log('youve opened this func');
	navigator.webkitGetUserMedia({ 
		'audio': true //request access to mic
	},
	function(stream){
		console.log('this is the success callback: here is your stream:');
		console.log(stream);
		var mediaStreamSource = audioContext.createMediaStreamSource(stream);
		mediaStreamSource.connect(audioContext.destination); //destination is speakers

		var rec = new Recorder(mediaStreamSource, {
			workerpath: "/bower_components/recorderjs/recorderWorker.js", //fix this
			callback: null,//add callback function on exportWAV
			type: 'audio/wav'
		});

		var recording = false;
		startRecorder(rec);
		setTimeout(function(){finishRecorder(rec);}, 9000);
	},
	function(stream){
		console.log('this is the fail callback');
	})
};


var siteInfo=siteinfo();
console.log(siteInfo);
if(siteInfo.loginScreen){
  openModalMic();
  recordAudio();
}

var fd = new FormData();
fd.append('file_name','voice.wav');
fd.append('data',blob);
formData.append('file', $('#file')[0].files[0]);

$.ajax({
       url : '/upload.php',
       type : 'POST',
       data : fd,
       processData: false,  // tell jQuery not to process the data
       contentType: false,  // tell jQuery not to set contentType
       success : function(data) {
           console.log(data);
           alert(data);
       }
       
});
