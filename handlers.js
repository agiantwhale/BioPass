var authMgr=new AuthManager(imageAuth);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // request.data -- blob
    console.log(request.data);
    async.waterfall([
      function(cb){
        authMgr.attemptAuth(request.data,function(result){
          cb(null,result);
        });
      },
      function(result, cb){
        console.log(result);
        if(result) {
          cb(null,{
            username:'agiantwhale@gmail.com',
            password:'e8bmjT2hZmM!M$4n^m&QX&NTM&!qUYG&pTD3CtNCpF5M*UzK%T'
          });
        }
      }
    ],function(err,result){
      console.log(result);
      if(err) sendResponse({type:'error'});
      else {
        sendResponse(_.extend({type:'success'},
                             result));
      }
    });
    return true;
  }
);
