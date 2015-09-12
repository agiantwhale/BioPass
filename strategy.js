function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
  else
      byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type:mimeString});
}

var imageAuth={
  userMedia:{
    audio:false,
    video:true
  },
  auth:function(payload,callback){
    async.waterfall([
      // Detects the faces first to obtain the Face ID
      function(cb){
        $.ajax({
          url:'https://api.projectoxford.ai/face/v0/detections',
          method: 'POST',
          contentType: 'application/octet-stream',
          cache: false,
          headers: {
            'Ocp-Apim-Subscription-Key': 'de654b6d9d014cc89b15a248e88154b3',
          },
          data:dataURItoBlob(payload),
          processData:false,
          success:function(result){
            cb(null,result);
          },
          error:function(xhr,status,error){
            cb(error);
          }
        });
      },

      // Detects the faces in parallel
      function(faces,cb){
        var veriTasks=_.map(faces, function(face) {
          return function(veriCb){
            $.ajax({
              url:'https://api.projectoxford.ai/face/v0/verifications',
              method: 'POST',
              headers: {
                'Ocp-Apim-Subscription-Key': 'de654b6d9d014cc89b15a248e88154b3'
              },
              dataType:'json',
              data:{
                faceId1:face.faceId,
                faceId2:'a3a35a43-69d1-4049-904a-24d6564686a3'
              },
              success:function(result){
                veriCb(null,result.isIdentical);
              },
              error:function(xhr,status,error){
                //veriCb(error,null);
                veriCb(null,false);
              }
            });
          };
        });

        async.parallel(veriTasks, function(err, results) {
          if(!_.isUndefined(_.find(results,true))) {
            cb(null,true);
          } else {
            cb(null,false);
          }
        });
      }
    ],function(err,results){
      if(results) {
        callback(true);
      } else {
        callback(false);
      }
    });
  }
};
