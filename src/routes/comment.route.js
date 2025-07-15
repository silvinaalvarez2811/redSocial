const { Router } = require("express");
const { commentController } = require("../controllers");
const router = Router()
const { validatorObjectId, cacheMiddleware } = require('../middlewares');

router.get("/", 
    cacheMiddleware.checkCacheAll("Comments"),
    commentController.getComments
);

router.get("/posts/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.checkCache("Comment"),
    commentController.getCommentsByPost
);  

router.get("/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.checkCache("Comment"),
    commentController.getCommentById
);

router.post("/", 
    commentController.createComment
);

router.put("/:id", 
    validatorObjectId.validarObjectId, 
    commentController.updateComment
);

router.delete("/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.deleteCache("Comment"),
    commentController.deleteComment
);

module.exports = router;
