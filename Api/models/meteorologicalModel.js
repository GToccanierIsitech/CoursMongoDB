const { MongoClient, ObjectId, Double } = require("mongodb");

const Meteorological = {
  region: { type: String },
  day: { type: Date },
  TempMax_Deg: { type: Double },
  TempMin_Deg: { type: Double },
  Wind_kmh: { type: Double },
  Wet_percent: { type: Double },
  Visibility_km: { type: Double },
  CloudCoverage_percent: { type: Double },
  pressure: { type: Double }
};

module.exports = { Meteorological, ObjectId };