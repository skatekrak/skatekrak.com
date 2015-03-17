var express = require('express');
var app = express();
var request = require('request');

app.set('view engine', 'ejs');
app.use('/startup', express.static(__dirname + '/startup'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/video', express.static(__dirname + '/video'));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/shot/:id', function(req, res){
	console.log('Media requested ' + req.params.id);
	var options = {
		uri: "https://api.parse.com/1/functions/getMediaForWebsite",
		method: "POST",
		form:{
			"id": req.params.id
		},
		headers:{
			"X-Parse-REST-API-Key":"q1wsETyv8qZPSoOBMO6TSkYlrsLl78bDcaA0dX7F",
			"X-Parse-Application-Id":"eAylqtIkKyTeSeCP830jkrGVs1LZEUiH4nTSGLJT",
		}
	};

	request(options,	
		function(error, response, body){
			res.render('shot', {
				media: JSON.parse(body).result
			});
		}
	);
});

app.get('/bestspotLA', function(req, res){
	res.render('bestspotLA');
});

app.get('/bestspotbarcelona', function(req, res){
	res.render('bestspotbarcelona');
});

app.get('*', function(req, res){
	res.redirect('/');
});

app.listen(8080);
console.log('8080 is the magic port');