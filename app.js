//Set up Express
const fs = require('fs')
const express = require('express');
const app = express();
const fileUpload = require("express-fileupload");

app.use(fileUpload());
app.use(express.static("public"));
app.use(express.static("recording"));
app.use(express.json());

app.get("/", (req, res) => {
    fs.createReadStream(__dirname + "/public/index.html").pipe(res);
})

// function update() {
//     console.log("Updating file list");
//     return new Promise((resolve, reject) => {
//         fs.readdir(__dirname + "/files/", (err, files) => {
//             if (err) {
//                 reject(err)
//             }
//             console.log(files);
//             resolve(files);
//         })
//     })
// }

// //Upload files with cache, write and read
// app.post("/upload", (req, res) => {
//     let files = req.files.filesubmit
//     console.log("uploading single file");
//     console.log(files)
//     let fileName = files.name;
//     let fileData = files.data;
//     cache[fileName] = writeFile(fileName, fileData);
//     cache[fileName].then(() => {
//             console.log("File Name: ", fileName);
//             console.log("File Data: ", cache[fileName]);
//             res.cookie(fileName, cache[fileName]);
//             console.log("Save single file");
//             res.redirect("/");
//         })
//         .catch((err) => {
//             console.log("Error: ", err);
//         })
// })

// Send file names to front end
// app.get("/upload", (req, res) => {
//     update().then((files) => {
//         console.log("Updated file list");
//         res.send(files);
//     })
// });

// Setting Up Server
app.listen(3000, function () {
    console.log("working on port 3000")
})