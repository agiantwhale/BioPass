function AuthInfoStore(url,callback){
  if(s.include(url,'www.facebook.com')){
    callback("username","password");
  }
}

function AuthManager(){ // Implementations of AuthMethod passed to arguments
  this.authStrategies=_.toArray(arguments);
}

AuthManager.prototype.registerAuth=function(callback){
  var authMgr=this;

  async.waterfall([
    // Get media stream
    function(cb){
      navigator.webkitGetUserMedia(
        {
          audio:true,
          video:true
        },
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

      async.parallel([
        function(audioCb){
          var audioRecorder=new MediaStreamRecorder(stream);
          audioRecorder.mimeType='audio/wav';
          audioRecorder.ondataavailable=function (blob) {
            audioCb(null,blob);
          };
        },
        function(videoCb){
          var videoRecorder=new MediaStreamRecorder(stream);
          videoRecorder.mimeType='audio/wav';
          videoRecorder.ondataavailable=function (blob) {
            videoCb(null,blob);
          };
        }
      ],function(err,results){
        results.unshift(null);
        cb.apply(cb,results);
      });

    },
    // Pass on to auth strategy
    function(audioBlob,videoBlob,cb){
      _.each(authMgr.authStrategies,function(strategy){
        if(strategy.userMedia.audio){
          strategy.register(audioBlob,function(result,token){});
        }

        if(strategy.userMedia.video){
          strategy.register(videoBlob,function(result,token){});
        }
      });
    }
  ],function(err,result){
    callback(result);
  });

};

AuthManager.prototype.attemptAuth=function(payload,callback){
  var authMgr=this;
  _.each(authMgr.authStrategies,function(strategy){
    strategy.auth(payload,function(result,token){
      callback(result);
    });
  });
};
