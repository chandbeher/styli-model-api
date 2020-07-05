const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const modelRouters = express.Router();

let Model = require('./model.schema');

const mongoose = require('mongoose');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/todos', { useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log("MongoDB Connection Success");
});

modelRouters.route('/').get((req, res) => {
    Model.find((error, models) => {
        if(error){
            res.json('Error during fetching error : ' + error);
        }else{
            res.json(models);
        }
    });
});

modelRouters.route('/:id').get((req, res) => {
    let id = req.params.id;
    Model.findById(id, (err, model) => {
        if(err){
            console.log(err);
        }else{
            res.json(model);
        }
    });
});


modelRouters.route('/add').post((req, res) => {
    let model = new Model(req.body);
    model.save()
        .then(model => {
            res.status(200).json({'model': 'Model added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to add model');
        });
});

modelRouters.route('/update/:id').post((req, res) => {
    Model.findById(req.params.id, (err, model) => {
        if(!model){
            res.status(404).send("Model not found");
        }else{
            model.name = req.body.name;
            model.gender = req.body.gender;
            model.bust = req.body.bust;
            model.waist = req.body.waist;
            model.height = req.body.height;
            model.highHip = req.body.highHip;
            model.lowHip = req.body.lowHip;
            model.save()
                .then(model => {
                    res.json(model);
                })
                .catch(err => {
                    res.status(400).send("Failed to update model");
                })
        }
    })
});

modelRouters.route('/:id').delete((req, res) => {
    Model.findByIdAndRemove(req.params.id, (err, model) => {
        if (err) 
            return res.status(400).send("There was a problem deleting the mdoel.");
        res.status(200).send("Model deleted.");
      });
});

modelRouters.route("/search").post( (req, res) => {
    let model = new Model(req.body);
    let modelFilter = null;
    Model.find({"name": model.name}, (err, model) => {
        if(err)
            res.json('Error during fetching record : ' + err);
        else
            res.json(model);
    });
});

app.use('/model', modelRouters);

app.listen(PORT, function(){
 console.log("Server is running in port " + PORT);
});
