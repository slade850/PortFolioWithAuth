const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const { ensureAuthenticated } = require('../config/auth');
const Project = require('../models/addProjectModel');

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});

let upload = multer({storage: storage});

//Welcome Page
router.get('/', (req, res) => {
    Project.find((err, projects) => {
        if (err){
            res.send(err); 
        }
        res.render('welcome', {projects: projects});
        })
    });

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
Project.find((err, projects) => {
    if (err){
        res.send(err); 
    }
    res.render('dashboard', { name: req.user.name, projects: projects});
    })
});


//Add Project
router.post('/add', ensureAuthenticated, upload.single('photo'), (req, res) => {
    // Nous utilisons le model addProject
    console.log(req.body);
    let project = new Project(req.body);
        project.img = req.file.filename;
    //Nous stockons l'objet en base
    project.save((err) => {
        if(err){ 
        res.send(err);
        }
        res.redirect('/dashboard');
    })
});

router.get('/maj/:project_id', ensureAuthenticated, (req, res) => {
    Project.findById(req.params.project_id, (err, project) => {
        if(err){
            res.send(err);
        }
        res.render('project', {name: req.user.name, project: project});
    });
})

//put
router.post('/maj/:project_id', ensureAuthenticated, upload.single('photo'), (req, res) => {

    const updates = {
        titre: req.body.titre,
        paragraphe: req.body.paragraphe,
        lien: req.body.lien
    }

    if (req.file) {
        Project.findById(req.params.project_id, (err, project) => {
            fs.unlink('./public/images/' + project.img, (err) => {
                if(err){
                    res.send(err);
                }
            });
        })
        updates.img = req.file.filename;
    }
    Project.findByIdAndUpdate(req.params.project_id, {
        $set: updates
    }, {
        new: true
    }).then(post => {
        req.flash('success_msg', 'All change are done');
        res.redirect('/dashboard');
    })
    .catch(err => {
        return req.flash('error', 'Unable to edit article');
    });
})


//delete
router.post('/del/:project_id', ensureAuthenticated, (req, res) => { 
    Project.findByIdAndDelete(req.params.project_id, (err, project) => {
        if(err){
            res.send(err);
        }
        fs.unlink('./public/images/' + project.img, (err) => {
            if(err){
                res.send(err);
            }
            req.flash('success_msg', 'Project delete successful');
            res.redirect('/dashboard');
        })
    }) 
});

module.exports = router;