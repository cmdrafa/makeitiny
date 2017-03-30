// JavaScript File
var express = require('express')
var app = express()
var port = process.env.PORT || 8080;
var path = require('path')
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');
var base58 = require('./base58.js');
var Url = require('./url');

mongoose.connect('mongodb://' + config.db.host + '/' + config.db.name);


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function(){
    console.log("Server running on port: " + port)
})

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
    
})

app.post('/api/tiny', function(req, res){
    var longUrl = req.body.url;
    var shortUrl = '';
    
    Url.findOne({long_url: longUrl}, function(err, doc){
        if(doc){
            shortUrl = config.webhost + ":" + port + base58.encode(doc._id);
            res.send({'shortUrl': shortUrl});
        }
        else{
            var newUrl = Url({
                long_url: longUrl
            })
            newUrl.save(function(err) {
                if(err){
                    console.log(err);
                }
                shortUrl = config.webhost + base58.encode(newUrl._id);
                res.send({'shortUrl': shortUrl});
                console.log(shortUrl)
            });
        }
    });
});

app.get('/:encoded_id', function(req, res){
    var base58Id = req.params.encoded_id;
    var id = base58.decode(base58Id);
    console.log("Id in app.get " + id)
    
    Url.findOne({_id: id}, function(err, doc){
        if(doc){
            res.redirect(doc.long_url);
            console.log("Inside the redirect: " + doc.long_url)
        }
        else{
            res.redirect(config.webhost);
            console.log("Also sending to localhost")
        }
    })
    
})