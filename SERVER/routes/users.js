const router = require('express').Router()
const auth = require('../middleware/auth');
const {signUp, signIn , signOut, updateUser, me} = require('../controllers/users')

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out",auth,signOut);
router.patch("/update-user/:userId",auth,updateUser);
router.get("/me",auth,me);

module.exports = router;
