const fs = require('node:fs')
const path = require("path");

const saveImage = (file) => {
  const newPath = `./uploads/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
}
 
const deleteImage= (path) => {
  fs.unlink(path,  (err) => {
    if (err) {throw err};
    console.log(`successfully deleted`);
  })
};

function fileFilter(req, file, cb) {

    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);

    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if(mimetype && extname) { 
        return cb(null, true);
    }

    cb(new Error("Only image are allowed"), false);
};

module.exports = { saveImage, deleteImage, fileFilter }