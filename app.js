//Set up Express
const fs = require('fs')
const express = require('express');
const app = express();
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static("recording"));
app.use(express.json());

//Landing Page
app.get("/", (req, res) => {
    fs.createReadStream(__dirname + "/public/index.html").pipe(res);
})

//Write function
const writeFile = (name, body) => {
    console.log("writing file");
    return new Promise((resolve, reject) => {
            fs.writeFile(__dirname + "/recording/" + name, body, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(name);
            })
        })
        .then(readFile);
}

//Read function
const readFile = (name) => {
    console.log("reading file");
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + "/recording/" + name, (err, body) => {
            if (err) {
                return reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

//Uploading file
app.post("/save", (req, res) => {
    console.log(req)
    let recording = req.files.file
    let fileName = recording.name
    let fileData = recording.data
    writeFile(fileName, fileData).then(() => {
        res.redirect("/");
    })
})

// Reading directory
function update() {
    console.log("Updating file list");
    return new Promise((resolve, reject) => {
        fs.readdir(__dirname + "/recording/", (err, files) => {
            if (err) {
                reject(err)
            }
            console.log(files);
            resolve(files);
        })
    })
}

// Send file names to front end
app.get("/save", (req, res) => {
    update().then((files) => {
        console.log("Updated file list");
        res.send(files);
    })
});

// Setting Up Server
app.listen(3000, function () {
    console.log("working on port 3000")
})