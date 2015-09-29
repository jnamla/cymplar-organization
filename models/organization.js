var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var organizationSchema = new Schema({
  
  name: {type: String, required: "Organization must have a name"},
  owner: {type: mongoose.Schema.Types.ObjectId, ref:'Admin'}, //Admin who created the organization
  admins:[{type: mongoose.Schema.Types.ObjectId, ref:'Admin'}], //Admins who were assigned to the organization
  domain: {type: String, index:{unique:true}, required: 'Please enter the organization domain'}, //Temporary key
  country: {type: String, required: 'Please enter your country'},
  state: {type: String, required: 'Please enter your state'},
  city: {type: String, required: 'Please enter your city'},
  street: {type: String, required: 'Please enter your street'},
  postCode: {type: String, required: 'Please enter your post code'},
  disableDate: {type: Date},
  created: {type: Date, default: Date.now}
});


var Organization = mongoose.model('Organization', organizationSchema);


// Pre save validations
organizationSchema.pre('save', function (next) {
    var self = this;
    
    if (!self.owner){
      next(new Error("The organization must have an owner!"));
    }
      
    Organization.find({domain : self.domain, 'owner': self.owner}, function (err, results) {
      if (err){
            next(err, {success: false, message: "Organization search failed."});
        }else{                
          if (!results.length){
              next();
          }else{  
              next(new Error("That organization is already registered for this administrator!"));
          }
        }
    });
});


module.exports = {
  Organization: Organization
};