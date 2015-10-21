var pmx = require('pmx');
pmx.init();

var express = require('express');
var app = express();
var request = require('request');

app.set('view engine', 'ejs');
app.use('/startup', express.static(__dirname + '/startup'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/video', express.static(__dirname + '/video'));

app.get('/homepage', function(req, res){
	res.render('index');
});

app.get('/:id', function(req, res){
	console.log('Media requested ' + req.params.id);
	var options = {
		uri: "https://krakmobileservice.azure-mobile.net/api/MediaShare/" + req.params.id,
		method: "GET"
	};
	request(options,
		function(error, response, body){
			var json = JSON.parse(body);
			res.render('shot', {
				result: json
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

app.get('/privacy-policy', function(req, res){
	res.render('privacy-policy');
});

app.get('*', function(req, res){
	res.redirect('/');
});

app.listen(8080);
console.log('80 is the magic port');

app.use(pmx.expressErrorHandler());
