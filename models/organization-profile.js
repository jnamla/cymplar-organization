var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var organizationProfileSchema = new Schema({
  organization: {type: mongoose.Schema.Types.ObjectId, ref:'Organization'}, // Key
  orgIndustry: {type: String, required: 'Please specify the industry'},
  bDescription: {type: String, required: 'Please enter a description'},
  teamSize: {type:Number, required: 'Please enter your team size'},
  web: {type: String},
  facebook: {type: String},
  linkedin: {type: String},
  twitter: {type: String},
  dribble: {type: String},
  pinterest: {type: String},
  disableDate: {type: Date},
  created: {type: Date, default: Date.now}
});

var OrganizationProfile = mongoose.model('OrganizationProfile', organizationProfileSchema);

// Pre save validations
organizationProfileSchema.pre('save', function (next) {
    var self = this;
    Private.find({organization : self.organization}, function (err, results) {
      if (err){
            next(err, {success: false, message: "Organization profile search failed"});
        }else{                
          if (!results.length){
              next();
          }else{  
              next(new Error("There is a profile for this organization!"));
          }
        }
    });
});


module.exports = {
  OrganizationProfile: OrganizationProfile
};