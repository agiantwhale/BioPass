var audioAuth={
  type:'voice',
  auth:function(payload,callback){
    // send AJAX request back to server
    // callback(true) on success
    // callback(false) on error
    var endpointUrl='http://localhost:3000/upload-wav';
    $.ajax({
      url: endpointUrl,
      type: 'POST',
      data: JSON.stringify({data:payload}),
      dataType: 'json',
      headers: {
        'Allow-Control-Allow-Origin': '*'
      },
      contentType: 'application/json',
      success: function(data) {
        callback(true);
      }
    })
  }
};
