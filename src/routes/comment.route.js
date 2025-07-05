const { Router } = require("express");
const { commentController } = require("../controllers");
const router = Router();
const { validarObjectId } = require('../middlewares/validatorObjectId');

router.get("/", 
    commentController.getComments
);

router.get("/posts/:id", 
    validarObjectId, 
    commentController.getCommentsByPost
);  

router.get("/:id", 
    validarObjectId, 
    commentController.getCommentById
);

router.post("/", 
    commentController.createComment
);

router.put("/:id", 
    validarObjectId, 
    commentController.updateComment
);

router.delete("/:id", 
    validarObjectId, 
    commentController.deleteComment
);

module.exports = router;
