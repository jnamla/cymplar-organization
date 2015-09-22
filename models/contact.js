var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  
  //Parents relevant data
  profile: {_id: {type: Schema.Types.ObjectId, required: "Company must be asociated with a profile" }, name: String, email: String}, // Reference to the admin who added this contact.
  organization: {type: mongoose.Schema.Types.ObjectId, required: 'This contact should be linked to an organization'}, // Reference to the organization this contact belongs to.
  isPrivate: {type: Boolean, default: false}, //Short path to filter the search.
  
  //Contact related data
  fullName: {type: String, required: 'Please enter the full name'}, 
  position: {type: String, required: 'Please enter the position'},
  phone: {type: String},
  mobile: {type: String, required: 'Please enter the contact mobile number'},
  email: {type: String, unique:true, index:true, required: 'Please enter the oficial email'},
  skype: {type: String, required: 'Please enter the skype'},
  personalEmail: {type: String},
  intensity: {type: String, default: "LOW"},
  stage: {type: String, default: "SUSPECT"},
  disableDate: {type: Date},
  created: {type: Date, default: Date.now}
});

var Contact = mongoose.model('Contact', contactSchema);

// Pre save validations
contactSchema.pre('save', function (next) {
    var self = this;
    Contact.find({name : self.name, 'profile._id': self.profile._id, organization: self.organization}, function (err, results) {
      if (err){
            next(err, {success: false, message: "Contact retrieve failed."});
        }else{                
          if (!results.length){
              next();
          }else{  
              next(new Error("That email is already in use!"));
          }
        }
    });
});

module.exports = {
  Contact: Contact
};