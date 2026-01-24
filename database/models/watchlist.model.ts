import { model, models, Schema, Document, Model } from "mongoose";

export interface WatchlistItem extends Document {
  userId: string;
  symbol: string;
  company: string;
  addedAt: Date;
}

const WatchlistSchema = new Schema<WatchlistItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, trim: true, uppercase: true },
    company: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  },
);

// Compound index to prevent duplicate stocks for the same user
WatchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist: Model<WatchlistItem> =
  models?.Watchlist || model<WatchlistItem>("Watchlist", WatchlistSchema);
