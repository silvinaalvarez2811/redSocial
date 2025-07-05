const { Router } = require("express");
const router = Router();
const { postImageController } = require("../controllers");
const { fileFilter } = require('../aditionalFunctions/image')
const multer = require('multer')
const { validarObjectId, validarPostId } = require('../middlewares/validatorObjectId');

const upload = multer ({ dest: 'uploads/', fileFilter, limits: { fileSize: 1024 * 1024 * 4 }})

router.get("/", 
    postImageController.getAllPostImages
);

router.post("/", 
    upload.array('images', 6),
    postImageController.createPostImages
);

router.put("/:id", 
    upload.single('image'),
    validarObjectId,
    postImageController.updatePostImage
);

router.delete("/:postId/:id", 
    validarPostId,
    validarObjectId,
    postImageController.deleteById
);


module.exports = router;