var express = require('express');
var router = express.Router();
var organizationService = require('../services/organization-service');
var jwts = require('../services/jwt-service');

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
router.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

    jwts.verify(token, function (err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // To do: define whether the token should be stored on the request
        req.admin = decoded; //This is the decrypted token or the payload you provided
        next();
      }
    });
    
	} else {
  		// if there is no token
  		// return an error
  		return res.status(403).send({ 
  			success: false, 
  			message: 'No token provided.'
  		});
	}
});


//------------------------------------------------
// Routes that need token verification
//------------------------------------------------


/* POST organization creation. */
router.post('/create', function(req, res, next) {
  
  organizationService.addOrganization(req.admin, req.body.organization, function(err, organization) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Create organization process failed."});
    }
  
    res.json(organization);
  });
});

router.post('/update', function(req, res, next) {
  
  organizationService.updateOrganization(req.admin, req.body.organization, function(err, organization) {
    if (err) {
      console.log(err);
     res.status(500).json({success: false, error: "Update organization process failed."});
    }
  
    res.json(organization);
  });
});

router.post('/remove', function(req, res, next) {
  
  organizationService.removeOrganization(req.admin, req.body.organization, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Delete organization process failed."});
    }
  
    res.json(result);
  });
});

// Search organizations by filters
router.post('/search', function(req, res, next) {
  
  organizationService.findOrganization(req.admin, req.body.organization, function(err, foundCompanies) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Failed to retrieve organizations'});
    }
  
    res.json(foundCompanies);
  });
});


/* POST organization profile creation. */
router.post('/prof/create', function(req, res, next) {
  
  organizationService.addOrganizationProfile(req.admin, req.body.organization, req.body.profile, function(err, organization) {
    if (err) {
      console.log(err);
      res.status(500).json({success: false, error: "Create organization profile process failed."});
    }
    
    res.json(organization);
  });
});

// Search organizations by profile filters
router.post('/prof/search', function(req, res, next) {

  organizationService.findOrganizationProfile(req.body.organization, req.body.profile, function(err, foundProfiles) {
    if (err) {
      console.log(err);
      return res.status(500).json({error: 'Failed to retrieve organizations'});
    }
    
    res.json(foundProfiles);
  });
});

router.post('/prof/update', function(req, res, next) {
  
  organizationService.updateOrganizationProfile(req.body.organization, req.body.profile, function(err, profile) {
    if (err) {
      console.log(err);
     res.status(500).json({success: false, error: "Update organization process failed."});
    }
    
    res.json(profile);
  });
});

module.exports = router;