module.exports = function(io, streams) {

  io.on('connection', function(client) {
    //console.log('-- ' + client.id + ' joined --');
    client.emit('id', client.id);
    // client.setTimeout(60000);
    // client.on('timeout', function(){
    //   client.end();
    // });
    //client.emit('id', );
    client.on('idChange', function(options) {

        console.log('1st-- ' + client.id + ' ori id--');
        client.id=options.idContent;
        console.log('2nd-- ' + client.id + ' change id and joined--');

        //streams.addStream(client.id, options.idContent);
    });

    // client.on('endCall', function(options) {
    //   client.id=options.idContent;
    //   console.log('end-- ' + client.id + ' end call--');
    //   streams.removeStream(client.id);
    //   // console.log('end-- ' + client.id + ' is ready to stream --');
    //   // streams.addStream(client.id, options.name);
    // });

    client.on('forDebug', function(options) {
      console.log('debug-- count: ' + options.count + '--localid: '+options.id);
    });

    client.on('message', function (details) {
        console.log('--from ' + client.id + ' --to '+details.to+' --type '+details.type);
        var otherClient;
        var array=Object.keys(io.sockets.connected);
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if(io.sockets.connected[array[i]].id==details.to){
                otherClient=io.sockets.connected[array[i]];
                console.log('ori--from ' + array[i]);
            }
        }
        if (!otherClient) {
            return;
        }
        delete details.to;
        details.from = client.id;
        otherClient.emit('message', details);
    });

    client.on('invite', function (details) {
      console.log('--from ' + client.id + ' --to '+details.to); //from android to web
        //need web call android
      var otherClient;
      var array=Object.keys(io.sockets.connected);
      var len = array.length;

      for (var i = 0; i < len; i++) {
          if(io.sockets.connected[array[i]].id==details.to){
              otherClient=io.sockets.connected[array[i]];
          }
      }
      if (!otherClient) {
          return;
      }
        delete details.to;
        details.from = client.id;
      otherClient.emit('getInvite', details);//web emit
    });

    client.on('endCall', function (details) {
      console.log('--from ' + client.id + ' --to '+details.to); //from android to web
      //need web call android
      var otherClient;
      var array=Object.keys(io.sockets.connected);
      var len = array.length;

      for (var i = 0; i < len; i++) {
          if(io.sockets.connected[array[i]].id==details.to){
              otherClient=io.sockets.connected[array[i]];
          }
      }
      if (!otherClient) {
          return;
      }
      delete details.to;
      details.from = client.id;
      otherClient.emit('getendCall', details);//web emit
    });
      
    client.on('readyToStream', function(options) {
      console.log('-- ' + client.id + ' is ready to stream --');
      
      streams.addStream(client.id, options.name); 
    });
    
    client.on('update', function(options) {
      streams.update(client.id, options.name);
    });

    function leave() {
      console.log('-- ' + client.id + ' left --');
      streams.removeStream(client.id);
      client.id='null';
    }

    client.on('disconnect', leave);
    client.on('leave', leave);
  });
};