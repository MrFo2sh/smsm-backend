var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var Status = new Schema({
    open:{
        type:Boolean,
        default:false
    },
    customers:{
        type:Number,
        default:0
    }
});


module.exports = mongoose.model('Status',Status);
