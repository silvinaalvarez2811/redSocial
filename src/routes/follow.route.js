const { Router } = require("express");
const router = Router();
const { followController } = require("../controllers");
const { validarObjectId, validarFollowId } = require('../middlewares/validatorObjectId');

router.get("/followers/:id", 
    validarObjectId, 
    followController.getFollowers
);

router.get("/following/:id", 
    validarObjectId, 
    followController.getFollowing
);

router.post("/", followController.createFollow);

router.delete("/:follower/:followed",
    validarFollowId,
    followController.deleteFollow
);

module.exports = router;