var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var config = require('./config.json');
var Status = require('./status');
var mongoose = require('mongoose');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); // support encoded bodies

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

var open = false;
var customers = 0;
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  useMongoClient: true
});

Status.find({}, function(err, status){
    if(err){
        customers =0;
        open = flase;
        console.log(err);
    }
    if(status[0]){
        open = status[0].open;
        customers = status[0].customers;
    }else{
        stat = new Status();
        stat.open=false;
        stat.customers = 0;
        stat.save((err)=>{
            console.log(err);
        });
    }
});


app.get('/status',function(req, res){
    res.json({open : open, customers: customers});
    console.log(open,customers);
});

app.post('/customerupdate',function(req ,res){
    if(req.body.value){
        customers+=req.body.value;
        Status.update({}, {customers: customers}, {multi: true}, function(err) { 
            console.log(err);
        });
        res.status(200).send({success:true,msg:"customers counter updated"});
    }else{
        res.status(400).send({success:false,msg:"failed to update customers counter"});
    }
    console.log(open,customers);
});

app.get('/updatestatus',function(req, res){
    if(open){
        open = false;
        customers = 0;
    }else {
        open = true;
        customers = 0;
    }
    Status.update({}, {$set:{customers: customers,open:open}}, {multi: true}, function(err) { 
        console.log(err);
    });
    console.log(open,customers);
    res.json({open: open});
});
var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log("app started");
});