const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
// logique pour les stockage telechargements de fichiers et modification d image avec multer
const imageFilter = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {  // startsWith javascript function: check that mimetype start by 'image'
    callback(null, true);
  } else {
    callback("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {    
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage, fileFilter: imageFilter }).single("file");
//module.exports = multer({ storage: storage }).single("image");