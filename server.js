var express = require('express');
var app = express();

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/privacy-policy', function(req, res){
	res.render('privacy-policy');
});

app.get('*', function(req, res){
	res.redirect('/');
});

app.listen(process.env.PORT || 8080);
console.log('8080 is the magic port');
