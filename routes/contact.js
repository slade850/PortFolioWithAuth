const express = require('express')
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const Contact = require('../models/contact');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let msg = {
    to: String,
    from: String,
    subject: 'New message',
    text: String,
};

router.post('/', (req, res) => {
    let contact = new Contact(req.body);
    msg.to = process.env.MY_MAIL;
    msg.from = req.body.email;
    msg.text = req.body.message;
        
    contact.save((err) => {
        if(err){ 
        res.send(err);
        }
        req.flash('success_msg', 'your message was sent successfully thanks');
        sgMail.send(msg);
        res.redirect('/');
    })
});

router.get('/response/:contact_id', ensureAuthenticated, (req, res) => {
    Contact.findById(req.params.contact_id, (err, contact) => {
        if (err){
            res.send(err);
        }
        res.render('mailres', {contact: contact});
    })
});

router.post('/response/:contact_id', ensureAuthenticated, (req, res) => {
    Contact.findById(req.params.contact_id, (err, contact) => {
        msg.from = 'reponse@julienBardin.dev';
        msg.to = contact.email;
        msg.text = req.body.message;

        if(err){ 
        res.send(err);
        }
        sgMail.send(msg);
        res.redirect('/contact/all');
    })
});

router.get('/all', ensureAuthenticated, (req, res) => {
    Contact.find((err, contact) => {
        if (err){
            res.send(err);
        }
        res.render('mailsview', {contact: contact});
    })
})
module.exports = router;