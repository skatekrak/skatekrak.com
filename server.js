var express = require('express');
var app = express();
var ECT = require('ect');
var request = require('request');

var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext : '.ect' });
app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/static', express.static(__dirname + '/static'));
app.use('/video', express.static(__dirname + '/video'));

app.get('/', function(req, res){
	res.render('index');
});

app.get('/app', function(req, res){

});

app.get('/map', function(req, res){

});

app.get('/box', function(req, res){

})

app.get('/about', function(req, res){

});

app.get('/contact', function(req, res){

});

app.get('/privacy-policy', function(req, res){
	res.render('privacy-policy');
});

app.get('*', function(req, res){
	res.redirect('/');
});

app.listen(8080);
console.log('8080 is the magic port');
