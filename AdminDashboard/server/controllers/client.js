import getCountryISO3 from "country-iso-2-to-3";
import _ from "lodash";

// Models import
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import Location from "../models/Locations.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";

// Get Products
export const getProducts = async (_, res) => {
  try {
    const products = await Product.find();
    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });

        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



// Get Customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get Slots
export const getSlots = async (req, res) => {
  try {
    const slots = await Location.find();
    res.status(200).json(slots);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// Get Locations
export const getLocations = async (req, res) => {
  try {
    const locations = await Location.aggregate([
      
      {
        $group: {
          _id: "$loc",
          count: { $sum: 1 },
          slots: { $push: "$slot_no" },
          booked: { $sum: { $cond: [{ $eq: ["$booked", "yes"] }, 1, 0] } },
          
        }
      },
      {
        $project: {
          _id: 0,
          loc: "$_id",
          slot_no: {
            $cond: {
              if: { $eq: [{ $size: "$slots" }, 1] },
              then: "1",
              else: { $size: "$slots" }
            }
          },
          booked: 1,
          
        }
      },
      {
        $addFields: { 
          currentPrice: {
            $add: [1, { $multiply: ["$booked", 0.025] }], // Example: $10 + $0.5 per booking
          },
        },
      },
    ]);
    locations.forEach((location) => {
      console.log("Location:", location.loc, "Current Price:", location.currentPrice);
    });
    res.status(200).json(locations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


// Get Transactions

export const getTransactions = async (req, res) => {
  try {
    const customers = await Transaction.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get Geography
export const getGeography = async (req, res) => {
  try {
    const users = await User.find();

    // Convert country ISO 2 -> ISO 3
    const mappedLocations = users.reduce((acc, { country }) => {
      const countryISO3 = getCountryISO3(country);
      if (!acc[countryISO3]) {
        acc[countryISO3] = 0;
      }

      acc[countryISO3]++;

      return acc;
    }, {});

    // format countries to match geography
    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
