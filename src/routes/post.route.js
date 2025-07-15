const { Router } = require("express");
const { postController } = require("../controllers");
const { fileFilter } = require("../aditionalFunctions/image");
const multer = require("multer");
const { validatorObjectId, cacheMiddleware } = require('../middlewares');

const router = Router();
const upload = multer({
  dest: "uploads/",
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 4 },
});

//rutas get
router.get("/full/:id", 
  validatorObjectId.validarObjectId, 
  cacheMiddleware.checkCache("Post"),
  postController.getPostwithImagesTagsCommentsById
);

router.get("/:id", 
  validatorObjectId.validarObjectId,
  cacheMiddleware.checkCache("Post"),
  postController.getPostById
);

router.get("/", 
  cacheMiddleware.checkCacheAll("Posts"),
  postController.getPosts
);

//post
router.post("/", 
  upload.array("images", 6), 
  postController.createPost
);

//put
router.put("/:id", 
  upload.array("images", 6), 
  validatorObjectId.validarObjectId, 
  postController.updatePost
);

router.put("/:id/images",
  upload.array("images", 6),
  validatorObjectId.validarObjectId,
  postController.updatePostImagesById
);

//patch - agregar tags a post
router.patch("/addTags/:id", 
  validatorObjectId.validarObjectId,
  postController.addTagsToPost
);

//delete
router.delete("/:id/:imageId", 
  validatorObjectId.validarPostImageIds,
  postController.deletePostImage
);

router.delete("/:id", 
  validatorObjectId.validarObjectId,
  cacheMiddleware.deleteCache("Post"),
  postController.deleteById
);

module.exports = router;
