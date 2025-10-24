console.log("✅ MONGODB_URI:", process.env.MONGODB_URI);

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// đảm bảo không undefined
const globalCache: MongooseCache = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = globalCache;

export async function connectDB() {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, { dbName: "magicwatches" }).then((m) => m);
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
