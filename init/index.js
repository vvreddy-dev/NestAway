const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/nestaway";

main()
    .then(() => {
        console.log("connted to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "687a58f1d7d116b5c4f49a7e",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
};

initDB();
