const { Router } = require("express");
const router = Router();
const { postImageController } = require("../controllers");
const { fileFilter } = require('../aditionalFunctions/image')
const multer = require('multer')
const { validatorObjectId, cacheMiddleware } = require('../middlewares');

const upload = multer ({ dest: 'uploads/', fileFilter, limits: { fileSize: 1024 * 1024 * 4 }})

router.get("/", 
    cacheMiddleware.checkCacheAll("PostImages"),
    postImageController.getAllPostImages
);

router.get("/:postId", 
    cacheMiddleware.checkCache("Images-post"),
    postImageController.getImagesByPost
);

router.post("/", 
    upload.array('images', 6),
    postImageController.createPostImages
);

router.put("/:id", 
    upload.single('image'),
    validatorObjectId.validarObjectId,
    postImageController.updatePostImage
);

router.delete("/:postId/:id", 
    validatorObjectId.validarPostId,
    validatorObjectId.validarObjectId,
    cacheMiddleware.deleteCache("PostImage"),
    postImageController.deleteById
);


module.exports = router;