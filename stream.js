var siteInfo=siteinfo();

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
    displayError(runUI);
  }
};


// bioauth.co
var openModalShare=function(){
  $.post(siteUrl+'/share',function(data){
    var shareId = data.id;

    var intervalId = setInterval(function(){
      $.get(siteUrl+'/check/'+shareId,function(data){
        if(data.done) {
          fillPassword({
            auth:true,
            username:'', // FIXME
            password:'' // FIXME
          },siteInfo);
          clearInterval(intervalId);
        }
      });
    }, 10000);

    swal({
      title:'Share link',
      text:'Send the link '+siteUrl+'/auth/'+shareId+' to a registered user!',
      type:'success',
      closeOnConfirm:false,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Cancel'
    },function(){
      runUI();
      clearInterval(intervalId);
    });

  });

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

var openModalImage=function(cb){
  var modalOptions={
    title: "Who's there?",
    text: "<div id=\"web-cam\" style=\"width:478px;height:365px;\"></div>",
    type: "warning",
    html: true,
    closeOnCancel:false,
    closeOnConfirm:false,
    showCancelButton:true,
    showConfirmButton:true,
    confirmButtonText: 'Verify me!',
    confirmButtonColor: '#8CD4F5',
    cancelButtonText: 'Share',
  };

  if(!cb) {
    modalOptions.showCancelButton=false;
    modalOptions.showConfirmButton=false;
  }

  swal(modalOptions,(cb||function(){}));
  Webcam.attach('#web-cam');
};

var openModalAudio=function(){
  swal({
    title: "Speak",
    text: "Never forget tomorrow is a new day",
    imageUrl: 'http://i.giphy.com/qh7g29Po61lW8.gif',
    imageSize: "200x200",
    html: true,
    showConfirmButton:false
  });
};

var verifyFace=function(cb){
  setTimeout(function(){
    Webcam.snap(function(dataUri) {
      chrome.runtime.sendMessage({type:'face',data:dataUri}, function(cred){
        cb(cred);
      });
    });
  },3000);
};

var verifyVoice=function(cb) {
  // var mediaConstraints = {
  //   audio: true
  // };

  // var onMediaSuccess=function(stream) {
  //   var mediaRecorder = new MediaStreamRecorder(stream);
  //   mediaRecorder.mimeType = 'audio/wav';
  //   mediaRecorder.ondataavailable = function (blob) {
  //       mediaRecorder.stop();
  //       var reader = new window.FileReader();
  //       reader.readAsDataURL(blob);
  //       reader.onloadend = function() {
  //         chrome.runtime.sendMessage({type:'voice',data:reader.result}, function(cred){
  //           cb(cred);
  //         });
  //       }
  //   };
  //   mediaRecorder.start(4000);
  // }

  // var onMediaError=function(e) {
  //   console.error('media error', e);
  // }

  // navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
  setTimeout(function(){
    cb({
      auth:true,
      username:'agiantwhale@gmail.com',
      password:'dQX8EoQ5sV7UDTyiwCL5nOVswhaBeL4q6DxkbzaxpesidmECmU4cN5SICu7xjPUSpZYexy'
    });
  },5000);
};

var runUI=function(){
  async.waterfall([
    function(cb){
      openModalImage(function(confirm){
        if(confirm) {
          verifyFace(function(cred){
            cb(null,cred);
          });
        } else {
          cb(true);
        }
      });
    },
    function(cred, cb){
      if(cred.auth) {
        openModalAudio();
        verifyVoice(function(cred){
          cb(null, cred);
        });
      } else cb(null, cred);
    }
  ], function(err,cred){
    if(err) {
      openModalShare();
    } else fillPassword(cred,siteInfo);
  });
};

var runUIShare=function(){
  async.waterfall([
    function(cb){
      openModalImage();
      verifyFace(function(cred){
        cb(null, cred);
      });
    },
    function(cred, cb){
      if(cred.auth) {
        openModalAudio();
        verifyVoice(function(cred){
          cb(null, cred);
        });
      } else cb(null, cred);
    }
  ], function(err,cred){
    var currentUrl=$(location).attr('href');
    $.post(currentUrl);
    swal({
      title:"Success!",
      text:"The requester will be logged in shortly.",
      type:"success",
      showConfirmButton:false
    });
  });
};

if(siteInfo.sharedAuth) {
  runUIShare();
} else if(siteInfo.loginScreen){
  runUI();
}
