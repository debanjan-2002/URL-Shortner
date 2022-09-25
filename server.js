const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ShortUrl = require("./models/urlShortner");
const app = express();

mongoose
    .connect("mongodb://localhost:27017/urlShortner")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
    res.redirect("/urls");
});

app.get("/urls", async (req, res) => {
    const urls = await ShortUrl.find({});
    res.render("index", { urls });
});

app.post("/urls", async (req, res) => {
    const { fullUrl } = req.body;
    const url = new ShortUrl({ full: fullUrl });
    await url.save();
    res.redirect("/urls");
});

app.get("/urls/:shortUrl", async (req, res) => {
    const { shortUrl } = req.params;
    const url = await ShortUrl.findOne({ short: shortUrl });
    if (url == null) return res.sendStatus(404);

    url.clicks++;
    url.save();

    res.redirect(url.full);
});

app.delete("/urls/:shortUrl/delete", async (req, res) => {
    const { shortUrl } = req.params;
    await ShortUrl.findOneAndDelete({ short: shortUrl });
    res.redirect("/urls");
});

app.listen(3000, () => {
    console.log("Listening on PORT 3000...");
});
