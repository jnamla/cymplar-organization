var OrganizationProfile = require('../models/organization-profile').OrganizationProfile;

exports.addOrganizationProfile = function(profile, organizationProfile, next) {
  var newOrganizationProfile = new OrganizationProfile({
    profile: profile,
    country: organizationProfile.country,
    state: organizationProfile.state,
    city: organizationProfile.city,
    postCode: organizationProfile.postCode,
    street: organizationProfile.street,
    name: organizationProfile.name.toLowerCase(),
    bDescription: organizationProfile.bDescription,
    disableDate: organizationProfile.disableDate,
    created: organizationProfile.created
  });
  
  newOrganizationProfile.save(function(err, savedOrganizationProfile) {
    if (!err) {
      return next(null, {success: true, organizationProfile: savedOrganizationProfile});
    }  
    next(err);
  });
};

exports.updateOrganizationProfile = function(updatableData, next) {
  
  // Find the organizationProfile by unique identifier
  this.findOrganizationProfileBykey(updatableData, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.organizationProfile) {
        next(null, {success:false, error: "The OrganizationProfile couldnt be found."});
      } else {
        // Removes email data to prevent the update of that field
        delete updatableData["email"];
      
        OrganizationProfile.update({ _id: result.organizationProfile._id}, {$set: updatableData}, function (err, updatedOrganizationProfile) {
        if (!err) {
            return next(null, updatedOrganizationProfile, {success:true, organizationProfile: updatedOrganizationProfile});
          }  
          next(err, {success:false , error: "OrganizationProfile not updated"});
        });
      }
    }
  });
};

exports.removeOrganizationProfile = function(keyValues, next) {
  // Find the organizationProfile by unique identifier
  this.findOrganizationProfileBykey(keyValues, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.organizationProfile) {
        next(null, {success:false, error: "The OrganizationProfile couldnt be found."});
      } else {
      
        OrganizationProfile.update({ _id: result.organizationProfile._id}, {$set: {disableDate: new Date()}}, function (err, updatedOrganizationProfile) {
        if (!err) {
            return next(null, updatedOrganizationProfile, {success:true, message: "OrganizationProfile removed."});
          }  
          next(err, {success:false , error: "OrganizationProfile not removed."});
        });
      }
    }
  });
};

// Find organizationProfile by defined key
exports.findOrganizationProfileBykey= function(data, next) {
  
  OrganizationProfile.findOne({email: data.email.toLowerCase()}, function(err, organizationProfile) {
    if (err) {
      next(err, {success:false});
    }
    next(err, {success:false, organizationProfile: organizationProfile});
  });
  
};

// FindOrganizationProfile Filters
exports.findOrganizationProfile = function(filters, next) {
  
  // Regular expresion to simplify the search
  for (var entry in filters) {
    if (filters[entry] != null && filters[entry] != undefined && filters[entry] != "") {
      filters[entry] = new RegExp(filters[entry], 'i');
    } else {
      delete filters[entry];  
    }
  }  
  
  filters['disableDate'] = null;
  
  OrganizationProfile.find(filters, function(err, organizations) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, organizations: organizations});
    }   
  });
};

exports.searchOrganizationProfileName = function(name, next) {
  
  var re = new RegExp(name, 'i');

  OrganizationProfile.find({name: re, disableDate:null}, function(err, organizations) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, organizations: organizations});
    }    
  });
};