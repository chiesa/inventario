const express = require('express');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const bodyParser = require('body-parser');
const imgModel = require('./js/imageSchema.js')
const config = require('./js/config.js')
const tipologie = ["Altro","Maschera","Maschera Africana","Scultura","Scultura Africana","Quadro","Medaglie","Strumenti","Armi"];

const app = express();

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())  
// Set EJS as templating engine 
app.set("view engine", "ejs");

console.log(`Setup connection with mongo: ${config.mongoURI}`)
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(_ => app.listen(config.port, console.log(`Listening on port ${config.port}`)))
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
  var page,skip;
  // si definiscono:
  //  - page: numero di pagina a cui si accede
  //  - skip: numero di elementi da saltare. (Sarà in base al numero di pagina e degli elementi visualizzati)
  if(!req.query.p) {
    page = 1;
    skip = 0;
  } else {
    page = parseInt(req.query.p);
    skip = (page-1)*8;
  }

  // si cercano nel DB tutti gli elementi, si orgina in base a num_id
  imgModel.find({})
    .sort({num_id:-1})
    .skip(skip)
    .limit(8)
    .then(result => { 
      // con il risultato del db si conta il numero di elementi nel DB per una questione grafica e si rimanda alla pagina iniziale
      imgModel.collection.count().then(result1 => {
        res.render('index', { obj: result, title: 'All Object', num:result1, page:page });
      });
    })
    .catch(err => {
      console.log(err);
  })
})

// pulsante di ricerca
app.get('/search', (req,res) => {
  let value;
  // definizione della chiave
  let query = req.query;
  var key = (Object.keys(query)[0]);
  
  // Si chiama la funzione che effettua la ricerca
  searching(req,query,res);

});

let searching = (req, query, res) => {
  const myArray = Object.keys(req.query);
  let key = myArray[0];
  let value = req.query[key];
  imgModel.find({
    [key] : {
      '$regex': new RegExp(value), 
      '$options': 'i'
    }
  },(err, data) => {
    if(err){
      console.log(err)
    } else {
      res.render('index', { obj: data, title: 'All Object', page:1, num:0 });
    }
  }).clone().catch(err => {
    console.log(err);
  })
}


app.get('/create', (_, res) => {
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