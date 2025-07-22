const mongoose  = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema  = new mongoose.Schema({
   
  name: {
    type: String,
    required: true,
    trim: true,
 
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
  },
  likedSongs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Song',
    default: []
  },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.matchPassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
