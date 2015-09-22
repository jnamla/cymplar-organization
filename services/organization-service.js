var Organization = require('../models/organization').Organization;
  
exports.addOrganization = function(profile, organization, next) {
  var newOrganization = new Organization({
    profile: profile,
    country: organization.country,
    state: organization.state,
    city: organization.city,
    postCode: organization.postCode,
    street: organization.street,
    name: organization.name,
    bDescription: organization.bDescription,
    industryType: organization.industryType,
    field: organization.field,
    website: organization.website,
    businessNumber: organization.businessNumber,
    disableDate: organization.disableDate,
    created: organization.created
  });
  
  newOrganization.save(function(err, savedOrganization) {
    if (!err) {
      return next(null, {success: true, organization: savedOrganization});
    }  
    next(err);
  });
};

exports.updateOrganization = function(profile, updatableData, next) {
  
  // Find the organization by unique identifier
  this.findOrganizationBykey(profile, updatableData, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.organization) {
        next(null, {success:false, error: "The Organization couldnt be found."});
      } else {
        // Removes email data to prevent the update of key fields
        delete updatableData["name"];
      
        Organization.update({ _id: result.organization._id}, {$set: updatableData}, function (err, updatedOrganization) {
        if (!err) {
            return next(null, updatedOrganization, {success:true, organization: updatedOrganization});
          }  
          next(err, {success:false , error: "Organization not updated"});
        });
      }
    }
  });
};

exports.removeOrganization = function(profile, organization, next) {
  // Find the organization by unique identifier
  this.findOrganizationBykey(profile, organization, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.organization) {
        next(null, {success:false, error: "The Organization couldnt be found."});
      } else {
        
        if (result.organization.disableDate)
          return next(null, {success:false, message: "Organization was already deleted."});
          
        Organization.update({ _id: result.organization._id}, {$set: {disableDate: new Date()}}, function (err, updatedOrganization) {
        if (!err) {
            return next(null, updatedOrganization, {success:true, message: "Organization removed."});
          }  
          next(err, {success:false , error: "Organization not removed."});
        });
      }
    }
  });
};

// Find organization by defined key
exports.findOrganizationBykey= function(profile, organization, next) {
  
  Organization.findOne({name: organization.name, 'profile._id': profile._id}, function(err, organization) {
    if (err) {
      next(err, {success:false});
    }
    next(err, {success:false, organization: organization});
  });
  
};

// FindOrganization Filters
exports.findOrganization = function(profile, filters, next) {
  
  // Regular expresion to simplify the search
  for (var entry in filters) {
    if (filters[entry] != null && filters[entry] != undefined && filters[entry] != "") {
      filters[entry] = new RegExp(filters[entry], 'i');
    } else {
      delete filters[entry];  
    }
  }  
  
  filters['disableDate'] = null;
  
  // Add profile filter
  filters['profile._id'] = profile._id;
  
  Organization.find(filters, function(err, organizations) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, organizations: organizations});
    }   
  });
};

exports.searchOrganizationName = function(name, next) {
  
  var re = new RegExp(name, 'i');

  Organization.find({name: re, disableDate:null}, function(err, organizations) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, organizations: organizations});
    }    
  });
};