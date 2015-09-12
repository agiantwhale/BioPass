var audioAuthMethod={
  userMedia:{
    audio:true,
    video:false
  },
  auth:function(payload,callback){
    callback(true,token);
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

