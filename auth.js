function AuthInfoStore(url,callback){
  if(s.include(url,'www.facebook.com')){
    callback("username","password");
  }
}

function AuthManager(){ // Implementations of AuthMethod passed to arguments
  this.authStrategies=_.toArray(arguments);
}

AuthManager.prototype.attemptAuth=function(payload,callback){
  var authMgr=this;
  _.each(authMgr.authStrategies,function(strategy){
    strategy.auth(payload,function(result,token){
      var authResult={auth:true};
      callback(authResult);
    });
  });
};
