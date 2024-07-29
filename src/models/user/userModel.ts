import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String, required: true },
  lastName: { type: String },
});

const userModel = mongoose.model('users', userSchema);

export default userModel;
