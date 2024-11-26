const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const urlSchema = mongoose.Schema({
    url: { type: String, required: true, unique: true },
    isValidated: { type: Boolean, default: false },
    addedAt: { type: Date, default: Date.now },
    validatedAt: { type: Date },
    validatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

urlSchema.pre('save', function(next) {
    if (this.isModified('isValidated') && this.isValidated) {
        this.validatedAt = new Date();
    }
    next();
});

urlSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Url', urlSchema);
