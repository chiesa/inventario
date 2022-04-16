var mongoose = require('mongoose');
  
var imageSchema1 = new mongoose.Schema({
    name: String,
    desc: String,
    type: { "type": String, "default": "Altro", "enum": ["Maschera","Maschera Africana","Scultura","Scultura Africana","Quadro","Medaglie","Strumenti","Armi","Altro"] },
    autor: String,
    pos: String,
    stanza: String,
    scatola: String,
    num_id: String,
    img:
    {
        data: Buffer,
        contentType: String,
    }
}, { timestamps: true });

//Image is a model which has a schema imageSchema
  
module.exports = new mongoose.model('Image', imageSchema1);