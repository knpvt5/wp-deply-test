import express from "express";
import pool from "../db/wealthSensedb.js";

const router = express.Router();

// setting API via Express route
router.get("/wise-investing", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM wise_investing");
        res.json(result.rows); // Return the single article object
    } catch (error) {
        console.error("Failed to fetch article:", error);
        res.status(500).send("Failed to fetch article");
    }
});

router.get("/smart-trading", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM smart_trading");
        res.json(result.rows); // Return the single article object
    } catch (error) {
        console.error("Failed to fetch article:", error);
        res.status(500).send("Failed to fetch article");
    }
});

export default router;