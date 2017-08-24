module.exports = function(app, streams) {

  // GET home 
    var index = function(req, res) {
    res.render('index', {//name here
                          title: 'Nova Video Doctor',
                          header: 'Video live streaming',
                          username: 'Hi doctor '+req.params.name,
                          share: 'Share this link',
                          footer: 'zefanfu@umich.edu',
                          id: req.params.id,
                          uid: req.params.uid
                        });
    console.log('--id ' + req.params.id + ' index --');
    console.log('--uid ' + req.params.uid + ' index --');
    };

    var indexAgain = function(req, res) {
        res.render('index', {
            title: 'Project RTC',
            header: 'WebRTC live streaming',
            username: 'Username',
            share: 'Share this link',
            footer: 'pierre@chabardes.net'
        });
    };

    // GET streams as JSON
    var displayStreams = function(req, res) {
        var streamList = streams.getStreams();
        // JSON exploit to clone streamList.public
        var data = (JSON.parse(JSON.stringify(streamList)));

        res.status(200).json(data);
    };

    app.get('/streams.json', displayStreams);
    //change here
    app.get('/signedin/:name/:uid', index);
    //app.get('/', index);
    app.get('/:id', index);
}