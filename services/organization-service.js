var Organization = require('../models/organization').Organization;
var OrganizationProfile = require('../models/organization-profile').OrganizationProfile;
  
exports.addOrganization = function(admin, organization, next) {
  
  var newOrganization = new Organization({
    owner: admin,
    country: organization.country,
    state: organization.state,
    city: organization.city,
    street: organization.street,
    postCode: organization.postCode,
    domain: organization.domain,
    disableDate: organization.disableDate,
    created: organization.created,
    name:organization.name
  });
  
  newOrganization.save(function(err, savedOrganization) {
    if (!err) {
      return next(null, {success: true, organization: savedOrganization});
    }  
    next(err);
  });
};

exports.updateOrganization = function(admin, updatableData, next) {
  
  // Find the organization by unique identifier
  this.findOrganizationBykey(admin, updatableData, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.data) {
        next(null, {success:false, error: "The Organization couldnt be found."});
      } else {
        // Removes email data to prevent the update of key fields
        delete updatableData["domain"];
      
        Organization.update({ _id: result.data._id}, {$set: updatableData}, function (err, updatedOrganization) {
        if (!err) {
            return next(null, updatedOrganization, {success:true, data: updatedOrganization});
          }  
          next(err, {success:false , error: "Organization not updated"});
        });
      }
    }
  });
};

exports.removeOrganization = function(admin, organization, next) {
  // Find the organization by unique identifier
  this.findOrganizationBykey(admin, organization, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.data) {
        next(null, {success:false, error: "The Organization couldnt be found."});
      } else {
        
        if (result.data.disableDate)
          return next(null, {success:false, message: "Organization was already deleted."});
          
        Organization.update({ _id: result.data._id}, {$set: {disableDate: new Date()}}, function (err, updatedOrganization) {
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
exports.findOrganizationBykey= function(admin, organization, next) {

  var conditions = {};
  
  if (!organization._id) {
    conditions['owner'] = !admin._id ? admin : admin._id; // Add admin filter
    conditions['domain'] = organization.domain;
  } else {
    conditions['_id'] = organization._id;
  }
  
  conditions['disableDate'] = null;
  
  Organization.findOne(conditions, function(err, organization) {
    if (err) {
      next(err, {success:false});
    }
    next(null, {success:true, data: organization});
  });
  
};

// FindOrganization Filters
exports.findOrganization = function(admin, filters, next) {
  
  // First set of conditions
  var conditions = {};
  
  // Regular expresion to simplify the search
  for (var entry in filters) {
    if (filters[entry] != null && filters[entry] != undefined && filters[entry] != "") {
      conditions[entry] = new RegExp(filters[entry], 'i');
    } 
  }
    
  conditions['disableDate'] = null;
  
  conditions['owner'] = !admin._id ? admin : admin._id; // Add admin filter
  
  Organization.find(conditions, function(err, organizations) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, data: organizations});
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
      next(null, {success: true, data: organizations});
    }    
  });
};

// ------------------------------------- Profile related activities -----------------------------------

exports.addOrganizationProfile = function(admin, organization, organizationProfile, next) {
  
  this.findOrganizationBykey(admin, organization, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.data) {
        next(null, {success:false, error: "The Organization couldnt be found."});
      } else {
        
        if (result.data.profile)
          return next(null, {success:false, message: "Organization already has a profile"});
        
        var newOrganizationProfile = new OrganizationProfile({
          organization: result.data,
          orgIndustry: organizationProfile.orgIndustry,
          bDescription: organizationProfile.bDescription,
          teamSize: organizationProfile.teamSize,
          web: organizationProfile.web,
          facebook: organizationProfile.facebook,
          linkedin: organizationProfile.linkedin,
          twitter: organizationProfile.twitter,
          dribble: organizationProfile.dribble,
          pinterest: organizationProfile.pinterest
        });
               
        newOrganizationProfile.save(function(err, savedOrganizationProfile) {
          
          if (err) {
            next(err, {success:false , error: "Profile couldnt be created"});
          } 
          
          next(null, {success: true, data: savedOrganizationProfile});
        });
      }
    }
  });
};

exports.updateOrganizationProfile = function(org, updatableData, next) {

  OrganizationProfile.findOne({$or:[{_id: org.profile},{organization: org._id}]}, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result) {
        next(null, {success:false, error: "The Organization profile couldnt be found."});
      } else {
        // Removes email data to prevent the update of key fields
        delete updatableData["_id"];
        delete updatableData["organization"];
      
        OrganizationProfile.update({ _id: result._doc._id}, {$set: updatableData}, function (err, updatedOrganizationProfile) {
        if (!err) {
            return next(null, {success:true, data: updatedOrganizationProfile});
          }  
          next(err, {success:false , error: "Organization Profile not updated"});
        });
      }
    }
  });
};

// organization with profile data Filters
exports.findOrganizationProfile = function(organization, filters, next) {
  
  // First set of conditions
  var conditions = {};
  
  // Regular expresion to simplify the search
  for (var entry in filters) {
    if (filters[entry] != null && filters[entry] != undefined && filters[entry] != "") {
      conditions[entry] = new RegExp(filters[entry], 'i');
    } 
  }
  
  conditions['disableDate'] = null;
  conditions["organization"] = !organization._id ? organization : organization._id; // Add organization filter
  
  OrganizationProfile.find(conditions).exec( function(err, profiles) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, data: profiles});
    }   
  });
};

