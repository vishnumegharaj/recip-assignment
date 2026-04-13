const mongoose = require('mongoose');;

// ─── Enums ────────────────────────────────────────────────────────────────────

 const KycStatus = Object.freeze({
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
});

const DeviceType = Object.freeze({
  MOBILE: 'Mobile',
  DESKTOP: 'Desktop',
});

 const OsType = Object.freeze({
  ANDROID: 'Android',
  IOS: 'iOS',
  WINDOWS: 'Windows',
  MACOS: 'macOS',
});

// ─── Sub-schema: deviceInfo ───────────────────────────────────────────────────

const deviceInfoSchema = new mongoose.Schema(
  {
    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },
    deviceType: {
      type: String,
      enum: {
        values: Object.values(DeviceType),
        message: 'deviceType must be Mobile or Desktop',
      },
      default: null,
    },
    os: {
      type: String,
      enum: {
        values: Object.values(OsType),
        message: 'os must be Android, iOS, Windows, or macOS',
      },
      default: null,
    },
  },
  { _id: false }
);


const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters'],
      match: [
        /^[a-zA-Z0-9_ ]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone:{
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number'],
    },

    walletBalance: {
      type: Number,
      default: 0,
      min: [0, 'Wallet balance cannot be negative'],
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    kycStatus: {
      type: String,
      enum: {
        values: Object.values(KycStatus),
        message: 'kycStatus must be Pending, Approved, or Rejected',
      },
      default: KycStatus.PENDING,
    },

    deviceInfo: {
      type: deviceInfoSchema,
      default: () => ({}),
    },
  },

  {
    timestamps: true,
  }
);


userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });

/**
 * Compound Index: Administrative Lookup
 * Why: This optimizes queries that filter for high-risk or specific 
 * user segments (e.g., "Show me all blocked users with pending KYC").
 */
userSchema.index({ isBlocked: 1, kycStatus: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;