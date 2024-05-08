import mongoose, { Model } from "mongoose";

// CONNECTING TO MONGOOSE (Get Database Url from .env.local)
const { DATABASE_URL } = process.env;

// connection function
export const connect = async () => {
  const conn = await mongoose
    .connect(DATABASE_URL as string)
    .catch((err) => console.error(err));
  console.log("Mongoose Connection Established");

  const referralSchema = new mongoose.Schema({
    referredAddress: {
      type: String,
      required: true,
    },
    referredAt: {
      type: Date,
      required: true,
      default: Date.now,
    }
  });

  const userSchema = new mongoose.Schema({
    address: {
      type: String,
      index: { unique: true, dropDups: true },
    },
    discord_id: {
      type: String,
      index: { unique: true, dropDups: true },
      default: "",
    },
   
    polka_address: {
      type: String,
      index: { unique: true, dropDups: true },
    },
    totalPts: { type: Number, default: 0 },
    totalRefferals: { type: Number, default: 0 },
    refferedBy: { type: String, default: "" },
    Latest_Discord_date: { type: Date, default: null },
    Latest_NFT_date: { type: Date, default: null },
    discord_joined_claim: { type: Boolean, default: false },
    nft_minted_claim: { type: Boolean, default: false },
    totalGMcount: { type: Number, default: 0 },
    totalDailyNFTcount: { type: Number, default: 0 },
    emailAdded: { type: Boolean, default: false },
    email: { type: String, default: "" },
    ZoNFTclaimed: { type: Boolean, default: false },
    ZoBalance: { type: Number, default: 0 },
    degen_date: { type: Date, default: null },
    degen_points: { type: Number, default: 0 },
    degenNFTClaimed: { type: Boolean, default: false },
    degenNFT: { type: Number, default: 0 },
    referrals: [referralSchema], // Embedding the referral schema
    joinedAt: { type: Date, default: Date.now }, // Time when user was created
    manta_staked_date:{ type: Date, default: null },
    manta_staked_points:{ type: Number, default: 0 },
    total_manta_staked:{ type: Number, default: 0 },
    manta_date: { type: Date, default: null },
    manta_points:{ type: Number, default: 0 },
    total_manta:{ type: Number, default: 0 },

  });

  const User = mongoose.models.Users || mongoose.model("Users", userSchema);

  return { conn, User };
};
