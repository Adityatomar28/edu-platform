import { authenticateUser, createUserAccount, signOutUser } from "../controllers/user.controllers";
import express from express;

const router = express.Router()

router.get('/signup',createUserAccount);
router.get('/signup',authenticateUser);
router.get("/signup",signOutUser);


export default router;
