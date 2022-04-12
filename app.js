require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
//const imgModel = require('./models.js')
const imgModel = require('./models1.js')
const assert = require('assert');
const tipologie = ["Altro","Maschera","Maschera Africana","Scultura","Scultura Africana","Quadro","Medaglie","Strumenti","Armi"];

const app = express();
const port = process.env.PORT || 8088;

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())  
// Set EJS as templating engine 
app.set("view engine", "ejs");

// remote connectio:
//const dbURI = "mongodb+srv://ObjCreatore:lLX5NNOWEWQVpyIm@cluster0.4borb.mongodb.net/objDatabase?retryWrites=true&w=majority";
// local connection:
const dbURI = "mongodb://localhost:27017/try"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(port, console.log(`Listening on port ${port}`)))
  .catch(err => console.log(err));


// create  storage path to save
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({ storage: storage });

//index get
app.get('/', (req, res) => {
  const filter = {};
  const projection = {
    '_id': 1, 
    'img': 1
  };
  var page,skip;
  const limit = 8;
  if(!req.query.p) {
    page = 1;
    skip = 0;
  } else {
    page = parseInt(req.query.p);
    skip = (page-1)*8;
  }
  
    imgModel.find({})//, { skip: skip, limit: limit })
    //imgModel.find(filter, { projection: projection, skip: 50, limit: 8 }//, (cmdErr, result) => {
    //  assert.equal(null, cmdErr);})
    //.sort({ createdAt: -1 })
    .sort({num_id:-1})
    .skip(skip)
    .limit(8)
    .then(result => { 
      imgModel.collection.count().then(result1 => {
      //result.forEach(element => {
        //console.log(element._id)  
        res.render('index', { obj: result, title: 'All Object', num:result1, page:page });
      });
      
    })//})
    .catch(err => {
      console.log(err);
    })
  
})

app.get('/search', (req,res) => {
  //let parmeter = req.params.par;
  let value;
  let query = req.query;
  var key = (Object.keys(query)[0]);
  switch (key){
    case "name":
      value = query.name;
      imgModel.find({
        'name' : {
          '$regex': new RegExp(value), 
          '$options': 'i'
        }
      },(err, data) => {
        //console.log(data.length())
        res.render('index', { obj: data, title: 'Search', page:1, num:0 });
      }).clone().catch(err => {
        console.log(err);
      })
      break;
    case "type":
      value = query.type;
      imgModel.find({
        'type' : {
          '$regex': new RegExp(value), 
          '$options': 'i'
        }
      },(err, data) => {
        //console.log(data.length())
        res.render('index', { obj: data, title: 'All Object', page:1, num:0  });
      }).clone().catch(err => {
        console.log(err);
      })
      break;
    case "pos":
      value = query.pos;
      imgModel.find({
        'pos' : {
          '$regex': new RegExp(value), 
          '$options': 'i'
        }
      },(err, data) => {
        //console.log(data.length())
        res.render('index', { obj: data, title: 'All Object', page:1, num:0  });
      }).clone().catch(err => {
        console.log(err);
      })
      break;
  }
});

app.get('/create', (req, res) => {
    res.render('imagePage', { title: "create", array:tipologie });
});

app.post('/', upload.single('image'), (req, res, next) => {
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        pos: req.body.pos,
        type: req.body.type,
        autor: req.body.author,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        stanza: req.body.stanza,
        scatola: req.body.scatola,
        num_id: req.body.num_id
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

app.get('/object/:id', (req, res) => {
    const id = req.params.id;
    imgModel.findById(id)
      .then(result => {
        res.render('object', { obj: result, title: 'Object Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });
  
app.delete('/object/:id', (req, res) => {
    const id = req.params.id;
    
    imgModel.findByIdAndDelete(id)
      .then(result => {
        res.json({ redirect: '/' });
      })
      .catch(err => {
        console.log(err);
      });
  });

app.get('/modify/:id', (req, res) => {
    const id = req.params.id;
    imgModel.findById(id)
      .then(result => {
        res.render('modify', { obj: result, title: 'Object Details', array:tipologie });
      })
      .catch(err => {
        console.log(err);
      });
  });

app.post('/modify/:id', upload.single('image'), (req, res, next) => {
    const id = req.params.id;
    if(req.file){
      imgModel.findByIdAndUpdate(id, {
        name: req.body.name,
          desc: req.body.desc,
          pos: req.body.pos,
          type: req.body.type,
          autor: req.body.author,
          img: {
              data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
              contentType: 'image/png'
          },
          stanza: req.body.stanza,
          num_id: req.body.num_id,
          scatola: req.body.scatola
        }, (err, item) => {
          if (err) {
              console.log(err);
          }
          else {
              // item.save();
              res.redirect(`/`);
          }
      })
    } else {
      imgModel.findByIdAndUpdate(id, {
        name: req.body.name,
          desc: req.body.desc,
          pos: req.body.pos,
          type: req.body.type,
          autor: req.body.author,
          stanza: req.body.stanza,
          scatola: req.body.scatola,
          num_id: req.body.num_id
        }, (err, item) => {
          if (err) {
              console.log(err);
          }
          else {
              // item.save();
              res.redirect(`/`);
          }
      })
    }
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})