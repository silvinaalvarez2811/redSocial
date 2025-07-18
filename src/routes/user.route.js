const { Router } = require("express");
const { userController } = require("../controllers");
const router = Router();
const { validatorObjectId, cacheMiddleware } = require('../middlewares');
const { fileFilter } = require('../aditionalFunctions/image')
const multer = require('multer')

const upload = multer ({ dest: 'uploads/avatar/', fileFilter, limits: { fileSize: 1024 * 1024 * 4 }})

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
    upload.single('image'),
    validatorObjectId.validarObjectId, 
    userController.updateUser
);

router.delete("/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.deleteCache("User"),
    userController.deleteById
);

module.exports = router;
