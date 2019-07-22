const mongoose = require('mongoose'); //Ont requière mongoose

// Création du Schéma
const addprojectSchema = mongoose.Schema({
    titre: String, 
    paragraphe: String,
    lien: String,
    img: String
}); 

/* Création du model avec mongoose.model les deux paramètre correspondent 
respectivement au nom et au Schéma utiliser pour le model. */ 
const addProject = mongoose.model('addProject', addprojectSchema);

// Pour finir ont exporte le model.
module.exports = addProject;