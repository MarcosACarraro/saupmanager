var express = require('express');
var bodyParser = require('body-parser');

var connection = require('./BackEnd/connection');
var projectService = require('./BackEnd/projectService');

var port = process.env.PORT || 3000;


var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var db = connection.db;
db.connect();

app.use(express.static(__dirname + '/frontEnd'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/frontEnd/Index.html');
});

app.get('/projects', function (req, res) {
    if (req.query["cmd"] != null) {
        if (req.query.cmd === "Select") {
            projectService.select(db, req.query, function (rows) {
                res.write(JSON.stringify(rows));
                res.end();
            });
        }
        if (req.query.cmd === "Count") {
            projectService.select(db, req.query, function (rows) {
                res.write(JSON.stringify(rows));
                res.end();
            });
        }
        if (req.query.cmd === "Delete") {
            projectService.exclude(db, req.query, function (err) {
                if (err) {
                    res.end('{"error" : "error", "status" : 500}');
                };
                res.end('{"success" : "success", "status" : 200}');
            });
        }
    }
});


app.post('/project', function (req, res) {
    var conta = req.body;
    projectService.save(db, conta, function (result) {
        res.end('{"success" : "success", "status" : 200}');
    });
});



var server = app.listen(port);
console.log('Servidor Express iniciado na porta %s', server.address().port);