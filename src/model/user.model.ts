import mongoose, { Model } from 'mongoose';

import bcrypt from 'bcrypt';

/**
 * Represents the data fields for a user.
 */
export interface UserData {
  email: string;
  name: string;
  password: string;
  address?: string;
}

/**
 * Represents a user document with additional mongoose fields.
 */
export interface UserDocument extends UserData, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;

  /**
   * Compares provided password with the stored hashed password.
   * @param candidatePassword The password to compare.
   * @returns A promise resolving to true if the passwords match, false otherwise.
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {}

export const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
userSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const saltRounds = parseInt(process.env.SALT_ROUND_FACTOR || '10'); // Default to 10 if not provided
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(this.password, salt);

  this.password = hash;
  next();
});

/**
 * Compares provided password with the stored hashed password.
 * @param candidatePassword The password to compare.
 * @returns A promise resolving to true if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel: UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);
