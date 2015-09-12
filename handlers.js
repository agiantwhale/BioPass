var authMgr=new AuthManager(imageAuth);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // request.data -- blob
    async.waterfall([
      function(cb){
        authMgr.attemptAuth(request.data,function(result){
          cb(null,result);
        });
      },
      function(result, cb){
        if(result.auth) {
          cb(null,
             result,
             {
              username:'agiantwhale@gmail.com',
              password:'w6VzbPKxYAZ@87%%Kw@dE8WVUQXhWWQQ28@!FHadc!^JETNcvx'
             }
            );
        } else {
          cb(null,result,{});
        }
      }
    ],function(err,result){
      if(err) sendResponse({type:'error'});
      else {
        sendResponse(_.extend({type:'success'},result));
      }
    });
    return true;
  }
);
