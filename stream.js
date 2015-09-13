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
    displayError(function(){
      openModal();
      verifyFace();
    });
  }
};

var displayError=function(cb){
  Webcam.reset();
  swal({
    title:"Error!",
    text:"Uh oh! You don't belong here.",
    type:"error",
    closeOnConfirm:false,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Try again?"
  },cb);
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
    title: "Speak",
    text: "Never forget tomorrow is a new day",
    imageUrl: 'http://i.giphy.com/qh7g29Po61lW8.gif',
    imageSize: "200x200",
    html: true,
    showConfirmButton:true
  });
};
var verifyFace=function(){
  setTimeout(function(){
    Webcam.snap(function(dataUri) {
      chrome.runtime.sendMessage({data:dataUri}, function(cred){
        fillPassword(cred,siteInfo);
      });
    });
  },3000);
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
      var reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function() {
        chrome.runtime.sendMessage({data:reader.result}, function(cred){
          fillPassword(cred,siteInfo);
        });
      }
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
