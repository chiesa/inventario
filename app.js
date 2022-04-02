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

const app = express();
const port = process.env.PORT || 8088;

app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())  
// Set EJS as templating engine 
app.set("view engine", "ejs");

const dbURI = "mongodb+srv://ObjCreatore:lLX5NNOWEWQVpyIm@cluster0.4borb.mongodb.net/objDatabase?retryWrites=true&w=majority";
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
  if(!req.query.p) { 
    imgModel.find( {},{maxTimeMS:100,_id:1,img:1}).sort({ createdAt: -1 })
    .skip(0)
    .limit(8)
    .then(result => {
      res.render('index', { obj: result, title: 'All Object' });
    })
    .catch(err => {
    console.log(err);
    })
  } else {
    const pos = (req.query.p -1)*10;
    imgModel.find( {},{maxTimeMS:100,_id:1,img:1}).sort({ createdAt: -1 })
    .skip(pos)
    .limit(8)
    .then(result => {
      res.render('index', { obj: result, title: 'All Object' });
    })
    .catch(err => {
    console.log(err);
    })
  }
});

app.get('/parz', (req, res) => {
  if(!req.query.p) { 
    console.log(err);
  } else {
    const pos = (req.query.p-1)*10;
    imgModel.find( {},{maxTimeMS:100,_id:1,img:1}).sort({ createdAt: -1 })
    .skip(pos)
    .limit(8)
    .then(result => {
      res.json({ obj: result, title: 'All Object' });
    })
    .catch(err => {
    console.log(err);
    })
  }
});


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
        res.render('index', { obj: data, title: 'All Object' });
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
        res.render('index', { obj: data, title: 'All Object' });
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
        res.render('index', { obj: data, title: 'All Object' });
      }).clone().catch(err => {
        console.log(err);
      })
      break;
  }
  key = 'desc'; /*TODO: modificare quando si cambia la struttura del DB*/
  console.log(value);


});

app.get('/create', (req, res) => {
    /*
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
    */
            res.render('imagePage', { title: "create" });
    //    }
    //});
});

app.post('/', upload.single('image'), (req, res, next) => {
  
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        pos: req.body.pos,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
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
        res.render('modify', { obj: result, title: 'Object Details' });
      })
      .catch(err => {
        console.log(err);
      });
  });

app.post('/modify/:id', upload.single('image'), (req, res, next) => {
    const id = req.params.id;
    imgModel.findByIdAndUpdate(id, {
        name: req.body.name,
        desc: req.body.desc,
        pos: req.body.pos
      }, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect(`/`);
        }
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
})