var express = require('express');
var router = express.Router();
var contactService = require('../services/contact-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET redirect to the create page. */
router.get('/create', function(req, res, next) {
  var vm = {
    title: 'Create a contact'
  };
  //res.render('companies/create', vm);
  res.send('in get/create');
});

/* POST contact creation. */
router.post('/create', function(req, res, next) {
  contactService.addContact(req.body, function(err, contactId) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Create contact process failed."});
    }
    //res.redirect('/contacts');
    res.json(contactId);
  });
});

router.post('/update', function(req, res, next) {
  
  contactService.updateContact(req.body, function(err, contact) {
    if (err) {
      console.log(err);
     res.status(500).json({success: false, error: "Update contact process failed."});
    }
    //res.redirect('/contacts');
    res.json(contact);
  });
});

router.post('/remove', function(req, res, next) {
  contactService.removeContact(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Delete contact process failed."});
    }
    //res.redirect('/contacts');
    res.json(result);
  });
});

// Search companies by name for autocomplete
router.get('/search_contact_name', function(req, res, next) {
  
  contactService.searchContactName(req.query.name, function(err, foundCompanies) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Failed to retrieve companies'});
    }
    
    res.json(foundCompanies);
  });
});

// Search companies by filters
router.post('/search', function(req, res, next) {
  
  contactService.findContact(req.body, function(err, foundCompanies) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Failed to retrieve companies'});
    }
    
    res.json(foundCompanies);
  });
});

module.exports = router;