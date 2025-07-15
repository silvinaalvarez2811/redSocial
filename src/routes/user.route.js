const { Router } = require("express");
const { userController } = require("../controllers");
const router = Router();
const { validatorObjectId, cacheMiddleware } = require('../middlewares');

// Probado - todo OK 
router.get("/", 
    cacheMiddleware.checkCacheAll("Users"),
    userController.getUsers
);

router.get("/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.checkCache("User"),
    userController.getUserById
);

router.post("/", 
    userController.createUser
);

router.put("/:id", 
    validatorObjectId.validarObjectId, 
    userController.updateUser
);

router.delete("/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.deleteCache("User"),
    userController.deleteById
);

module.exports = router;
