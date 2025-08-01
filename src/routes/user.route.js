const { Router } = require("express");
const { userController } = require("../controllers");
const router = Router();
const { validatorObjectId, cacheMiddleware } = require('../middlewares');
const { fileFilter } = require('../aditionalFunctions/image')
const multer = require('multer')

const upload = multer ({ dest: 'uploads/avatar', fileFilter, limits: { fileSize: 1024 * 1024 * 4 }})

// Probado - todo OK
router.get(
  "/",
  cacheMiddleware.checkCacheAll("Users"),
  userController.getUsers
);

router.get(
  "/user",
  userController.getUserByUsername
);

router.get(
  "/:id",
  validatorObjectId.validarObjectId,
  cacheMiddleware.checkCache("User"),
  userController.getUserById
);

router.get(
  "/:id/full",
  validatorObjectId.validarObjectId,
  userController.getUserByIdFull
);

router.get("/:id/history", userController.getHistoryById);

router.post("/", 
    userController.createUser
);

router.patch("/:id", 
    validatorObjectId.validarObjectId, 
    upload.single('image'),
    userController.updateUser
);

router.delete("/:id", 
    validatorObjectId.validarObjectId, 
    cacheMiddleware.deleteCache("User"),
    userController.deleteById
);

module.exports = router;
