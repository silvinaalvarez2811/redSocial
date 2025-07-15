const { Router } = require("express");
const { tagController } = require("../controllers");
const router = Router();
const { validatorObjectId, cacheMiddleware } = require('../middlewares');

router.get("/", 
    cacheMiddleware.checkCacheAll("Tags"),
    tagController.getTags
);

router.post("/", tagController.createTag);

router.put("/:id", 
    validatorObjectId.validarObjectId,
    tagController.updateTag
);

router.delete("/:id", 
    validatorObjectId.validarObjectId,
    cacheMiddleware.deleteCache("Tag"),
    tagController.deleteById
);

module.exports = router;
