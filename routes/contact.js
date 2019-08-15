const express = require('express')
const router = express.Router();
const Contact = require('../models/contact');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

let msg = {
    to: 'julien.bardin81@gmail.com',
    from: 'Portfolio@jb.com',
    subject: 'New message',
    text: 'you received a new message',
};

router.post('/', (req, res) => {
    let contact = new Contact(req.body);
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

module.exports = router;