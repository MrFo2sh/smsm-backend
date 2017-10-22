var express = require("express");
var bodyParser = require("body-parser");
var app = express();

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

app.get('/status',function(req, res){
    res.json({open : open, customers: customers});
    console.log(open,customers);
});

app.post('/customerupdate',function(req ,res){
    if(req.body.value){
        customers+=req.body.value;
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
    console.log(open,customers);
    res.json({open: open});
});

app.listen(3000,function(){
    console.log("app started");
});