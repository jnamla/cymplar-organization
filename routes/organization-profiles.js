var express = require('express');
var router = express.Router();
var organizationProfileService = require('../services/organization-profile-service');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET redirect to the create page. */
router.get('/create', function(req, res, next) {
  var vm = {
    title: 'Create a organizationProfile'
    
  };
  //res.render('organizations/create', vm);
  res.send('in get/create');
});

/* POST organizationProfile creation. */
router.post('/create', function(req, res, next) {
  organizationProfileService.addOrganizationProfile(req.body, function(err, organizationProfileId) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Create organizationProfile process failed."});
    }
    //res.redirect('/contacts');
    res.json(organizationProfileId);
  });
});

router.post('/update', function(req, res, next) {
  
  organizationProfileService.updateOrganizationProfile(req.body, function(err, organizationProfile) {
    if (err) {
      console.log(err);
     res.status(500).json({success: false, error: "Update organizationProfile process failed."});
    }
    //res.redirect('/contacts');
    res.json(organizationProfile);
  });
});

router.post('/remove', function(req, res, next) {
  organizationProfileService.removeOrganizationProfile(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Delete organizationProfile process failed."});
    }
    //res.redirect('/contacts');
    res.json(result);
  });
});

// Search organizations by filters
router.post('/search', function(req, res, next) {
  
  organizationProfileService.findOrganizationProfile(req.body, function(err, foundCompanies) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Failed to retrieve organizations'});
    }
    
    res.json(foundCompanies);
  });
});

module.exports = router;