var express = require('express');
const compress = require("compression");
var app = express();

app.use(compress());
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/build/html/index.html')
});

app.get('/privacy-policy', function(req, res){
	res.sendFile(__dirname + '/views/privacy-policy.html')
});

app.get('*', function(req, res){
	res.redirect('/');
});

app.listen(process.env.PORT || 8080);
console.log('8080 is the magic port');
