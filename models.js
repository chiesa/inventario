var mongoose = require('mongoose');
  
var imageSchema = new mongoose.Schema({
    name: String,
    desc: String,
    type: { "type": String, "default": "Altro", "enum": ["Maschera","Scultura","Quadro","Altro"] },
    autor: String,
    pos: String,
    img:
    {
        data: Buffer,
        contentType: String,
    }
}, { timestamps: true });

//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('Image', imageSchema);