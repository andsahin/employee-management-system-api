import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    requestType: {
      type: String,
    },
    initVector: {
      type: String,
    },
    securityKey: {
      type: String,
    },
    verifyToken: {
      type: String,
    },
    status: {
      type: String,
      default: "unverified",
      enum: {
        values: ["unverified", "verified"],
        message: "{VALUE} is not supported",
      },
    },
    expireAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

verificationSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

const VerificationModel =
  mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);

export { VerificationModel };
