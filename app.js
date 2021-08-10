//Set up Express
require('dotenv').config()
const fs = require('fs')
const express = require('express');
const app = express();
const fileUpload = require("express-fileupload");
const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

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

//Saving file
app.post("/save", (req, res) => {
    console.log(req)
    let recording = req.files.file
    let fileName = recording.name
    let fileData = recording.data
    writeFile(fileName, fileData).then(() => {
        res.redirect("/");
    })
})

//Uploading to AWS S3
app.post("/upload", (req, res) => {
    console.log(process.env.AWS_ACCESS_KEY)
    console.log(process.env.AWS_SECRET_ACCESS_KEY)
    console.log("Uploading file")
    let recording = req.files.file
    let fileName = recording.name
    let fileData = recording.data
    return writeFile(fileName, fileData)
    .then(() => {
        console.log("Writing file")
        return fs.readFile(__dirname + "/recording/" + fileName, (err, data) => {
            if (err) {throw err}
            const params = {
                Bucket: 'testingbucketwebdev',
                Key: fileName,
                ContentType: 'video/mp4',
                Body: fileData
            }
            s3.upload(params, (s3Err, data) => {
                if (s3Err) {
                    console.log(s3Err)
                    throw s3Err
                }
                console.log("File upload successful")
            })
        })
    })
    .then(() => {
        let result = s3.getResourceURL("testingbucketwebdev", fileName)
        console.log("URL", result)
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