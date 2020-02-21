const express = require("express");
const path = require("path");

const complements = [
    "You look nice today",
    "That dress looks nice on you",
    "Have you been working out?",
    "You can do hard things",
    "You've gotten far in this course. You're really smart",
    "You're programming! How cool is that?",
    "I'm really proud of you",
    "You made this",
    "You've learned a lot of things, and that's pretty hard to do"
]

const insults = [
    "Your mother was a hampster, and your father smelt of eldeberries!",
    "Go away away or I shall taunt you a second time!",
    "I fart in your general direction!",
    "You don't frighten us, English pig dogs.",
    "Go and boil your bottoms, you sons of a silly person. I blow my nose at you.",
    "I don't want to talk to you no more, you empty headed animal food trough wiper."
]

function getRandomComplement() {
    return complements[Math.floor(Math.random() * complements.length)]
}

function getRandomInsult() {
    return insults[Math.floor(Math.random() * insults.length)]
}

const app = express();

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/complement", function (req, res) {
    res
        .json({
            complement: getRandomComplement()
        })
        .end();
});

app.get("/insult", function (req, res) {
    res
        .json({
            insult: getRandomInsult()
        })
        .end();
})

app.use("/public", express.static("./public"));

app.listen(3000);
console.log("listening on http://localhost:3000");