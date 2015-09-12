var audioAuthMethod={
  userMedia:{
    audio:true,
    video:false
  },
  auth:function(payload,callback){

	$.ajax(){
		url: "https://siv.voiceprintportal.com/api/authentications/bywavurl"
		type: "POST",
		headers: {
			"VsitEmail"	: "stephenhuh@gmail.com",
			"VsitPassword" : "testpassword",
			"VsitDeveloperId" : "294386", 
			"VsitAccuracy" : "3", //0(strictest) - 5(laxest)
			"VsitAccuracyPasses" : "3",
			"VsitAccuracyPassIncrement" : "1",
			"VsitConfidence" : "85" // 85 laxest - 100 strictest
			"VsitWavUrl" : "recognize.me" //namecheap
		},
		data: {},
		dataType: "json",
		success: function(response){
			var string = "Authentication successful."
			callback(response.Result.indexOf(string) > -1);
		}
		error: function(response){
			callback(false);
		}
	}
	  //send post request 
	  //if its the actual true pass true to callback
  }
};

var videoAuthMethod={
  userMedia:{
    audio:false,
    video:true
  },
  auth:function(payload,callback){
    callback(true,token);
  }
};

var uploadFiles = function(files) {
	//upload file via ajax
}

var authMgr = new AuthManager(audioAuthMethod, videoAuthMethod);
authMgr.attemptAuth(function(result){
	login();
});

function AuthInfoStore(url,callback){
  if(s.include(url,'www.facebook.com')){
    callback("username","password");
  }
}

function AuthManager(){ // Implementations of AuthMethod passed to arguments
  this.authStrategies=_.toArray(arguments);
}

AuthManager.prototype.attemptAuth=function(callback){
  var authMgr=this;

  _.each(authMgr.authStrategies,function(strategy){

    async.waterfall([
      // Get media stream
      function(cb){
        navigator.webkitGetUserMedia(
          strategy.userMedia,
          function(stream){
            cb(null,stream);
          },
          function(error){
            cb(error);
          }
        );
      },
      // Record stream
      function(stream, cb){
        var mediaRecorder = new MediaStreamRecorder(stream);
        mediaRecorder.mimeType='audio/wav';
        mediaRecorder.ondataavailable = function (blob) {
          // POST/PUT "Blob" using FormData/XHR2
          // var blobURL = URL.createObjectURL(blob);
          // document.write('<a href="' + blobURL + '">' + blobURL + '</a>');
          cb(null,blob);
        };
      },
      // Pass on to auth strategy
      function(blob,cb){
        strategy.auth(blob,function(result,token){
          cb(null,result);
        });
      }
    ],function(err,result){
      callback(result);
    });

  });
};

