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

    navigator.webkitGetUserMedia(
      strategy.userMedia,
      function(stream){
      },
      function(error){
        alert('Unable to access device!');
      }
    );

  });
};

