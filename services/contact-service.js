var Contact = require('../models/contact').Contact;

exports.addContact = function(owner, organization, contact, next) {
  
  var newContact = new Contact({
    
  admin: owner,
  organization: organization.id,
  isPrivate: organization.isPrivate,
  
  fullName: contact.fullName,
  position: contact.position,
  phone: contact.phone,
  mobile: contact.mobile,
  email: contact.email.toLowerCase(),
  skype: contact.skype,
  personalEmail: contact.personalEmail,
  intensity: contact.intensity,
  stage: contact.stage,
  disableDate: contact.disableDate,
  created: contact.created
  });
  
  newContact.save(function(err, savedContact) {
    if (!err) {
      return next(null, {success: true, contact: savedContact});
    }  
    next(err);
  });
};

exports.updateContact = function(owner, organization, updatableData, next) {

  // Find the contact by unique identifier
  this.findContactBykey(updatableData, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.contact) {
        next(null, {success:false, error: "The Contact couldnt be found."});
      } else {
        // Removes email data to prevent the update of that field
        delete updatableData["email"];
      
        Contact.update({ _id: result.contact._id}, {$set: updatableData}, function (err, updatedContact) {
        if (!err) {
            return next(null, updatedContact, {success:true, contact: updatedContact});
          }  
          next(err, {success:false , error: "Contact not updated"});
        });
      }
    }
  });
};

exports.removeContact = function(keyValues, next) {
  // Find the contact by unique identifier
  this.findContactBykey(keyValues, function (err, result) {
    if (err) {
      next(err, result);
    } 
    else {
      if (!result.contact) {
        next(null, {success:false, error: "The Contact couldnt be found."});
      } else {
      
        Contact.update({ _id: result.contact._id}, {$set: {disableDate: new Date()}}, function (err, updatedContact) {
        if (!err) {
            return next(null, updatedContact, {success:true, message: "Contact removed."});
          }  
          next(err, {success:false , error: "Contact not removed."});
        });
      }
    }
  });
};

// Find contact by defined key
exports.findContactBykey= function(data, next) {
  
  Contact.findOne({email: data.email.toLowerCase()}, function(err, contact) {
    if (err) {
      next(err, {success:false});
    }
    next(err, {success:false, contact: contact});
  });
  
};

// FindContact Filters
exports.findContact = function(filters, next) {
  
  // Regular expresion to simplify the search
  for (var entry in filters) {
    if (filters[entry] != null && filters[entry] != undefined && filters[entry] != "") {
      filters[entry] = new RegExp(filters[entry], 'i');
    } else {
      delete filters[entry];  
    }
  }  
  
  filters['disableDate'] = null;
  
  Contact.find(filters, function(err, companies) {
    if (err) {
      next(err);
    } 
    else {
      next(null, {success: true, companies: companies});
    }   
  });
};