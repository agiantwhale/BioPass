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
};

var openModalMic=function(){
  swal({
    title: "Speak: 'Never forget tomorrow is a new day'",
    text: "<div id=\"microphone\" style=\"width:100%;height:300px;\"></div>",
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
        console.log(dataUri);
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
