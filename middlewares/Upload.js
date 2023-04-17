var path = require("path");
const util = require("util");
const multer = require("multer");
const maxSize = 10 * 1024 * 1024;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("__dirname", __dirname);
    // cb(null, path.join("/home/ineslebackyard/Desktop/", "important"));
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split("/")[1];
    cb(null, file.fieldname + "-" + Date.now() + "." + extension);
  },
});
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image");

console.log("uploadFile", uploadFile);
let uploadFileMiddleware = util.promisify(uploadFile);
console.log("uploadFileMiddleware", uploadFileMiddleware);
module.exports = uploadFileMiddleware;
