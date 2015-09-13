function AuthManager(){ // Implementations of AuthMethod passed to arguments
  this.authStrategies=_.toArray(arguments);
}

AuthManager.prototype.attemptAuth=function(payload,callback){
  var authMgr=this;
  var authStrategy=_.findWhere(authMgr.authStrategies,{type:payload.type});
  authStrategy.auth(
  payload.data,
  function(result,token){
    var authResult={auth:result};
    callback(authResult);
  });
};
