var mongoose = require('mongoose');
  
var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    pos: String,
    img:
    {
        data: Buffer,
        contentType: String,
        //required: true
    }
}, { timestamps: true });

//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('Image', imageSchema);