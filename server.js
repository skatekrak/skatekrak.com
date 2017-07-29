var express = require('express');
var fs = require("fs");
const compress = require("compression");
var app = express();

app.use(compress());
app.use('/assets', express.static(__dirname + '/assets'));

app.engine('ntl', function (filePath, options, callback) { // define the template engine
  fs.readFile(filePath, function (err, content) {
    if (err) return callback(err)
    // this is an extremely simple template engine
	var rendered = content.toString()
	.replace('#resetToken#', options.resetToken)
    return callback(null, rendered)
  })
})
app.set('views', './views') // specify the views directory
app.set('view engine', 'ntl') // register the template engine

app.get('/', function(req, res){
	res.sendFile(__dirname + '/build/html/index.html')
});

app.get('/privacy-policy', function(req, res){
	res.sendFile(__dirname + '/views/privacy-policy.html')
});

app.get("/reset/:resetToken", function(req, res) {
	res.render("reset", {resetToken: req.params.resetToken});
})

app.get('*', function(req, res){
	res.redirect('/');
});

app.listen(process.env.PORT || 8080);
console.log('8080 is the magic port');
