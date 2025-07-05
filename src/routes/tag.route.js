const { Router } = require("express");
const { tagController } = require("../controllers");
const router = Router();
const { validarObjectId } = require('../middlewares/validatorObjectId');

router.get("/", tagController.getTags);

router.post("/", tagController.createTag);

router.put("/:id", 
    validarObjectId,
    tagController.updateTag
);

router.delete("/:id", 
    validarObjectId,
    tagController.deleteById
);

module.exports = router;
