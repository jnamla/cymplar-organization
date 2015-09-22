var express = require('express');
var router = express.Router();
var organizationService = require('../services/organization-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET redirect to the create page. */
router.get('/create', function(req, res, next) {
  var vm = {
    title: 'Create a organization'
    
  };
  //res.render('organizations/create', vm);
  res.send('in get/create');
});

/* POST organization creation. */
router.post('/create', function(req, res, next) {
  organizationService.addOrganization(req.body.profile, req.body.organization, function(err, organization) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Create organization process failed."});
    }
    //res.redirect('/contacts');
    res.json(organization);
  });
});

router.post('/update', function(req, res, next) {
  
  organizationService.updateOrganization(req.body.profile, req.body.organization, function(err, organization) {
    if (err) {
      console.log(err);
     res.status(500).json({success: false, error: "Update organization process failed."});
    }
    //res.redirect('/contacts');
    res.json(organization);
  });
});

router.post('/remove', function(req, res, next) {
  organizationService.removeOrganization(req.body.profile, req.body.organization, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Delete organization process failed."});
    }
    //res.redirect('/contacts');
    res.json(result);
  });
});

// Search organizations by filters
router.post('/search', function(req, res, next) {
  
  organizationService.findOrganization(req.body.profile, req.body.organization, function(err, foundCompanies) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Failed to retrieve organizations'});
    }
    
    res.json(foundCompanies);
  });
});

module.exports = router;