var authMgr=new AuthManager(imageAuth,audioAuth);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // request.data -- blob
    async.waterfall([
      function(cb){
        authMgr.attemptAuth(request,function(result){
          cb(null,result);
        });
      },
      function(result, cb){
        if(result.auth) {
          cb(null,
             _.extend(result,
             {
              username:'agiantwhale@gmail.com',
              password:'dQX8EoQ5sV7UDTyiwCL5nOVswhaBeL4q6DxkbzaxpesidmECmU4cN5SICu7xjPUSpZYexy'
             }
            ));
        } else {
          cb(null,result);
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
