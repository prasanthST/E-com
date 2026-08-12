import express from 'express'
import { login, logout, resetPassword,forgetPassword, userRegister , profile, updatePassword,profileUpdate , getUsers , getSingleUser,updateUserRole, deleteUser} from '../controllers/userController.js';
import { roleBasedAccess, verifyUser } from '../helper/userAuth.js';

const router = express.Router()

router.route("/register").post(userRegister)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/password/forget").post(forgetPassword )
router.route("/reset/:token").post(resetPassword)
router.route("/profile").get(verifyUser , profile)
router.route("/password/update").put(verifyUser, updatePassword)
router.route("/profile/update").put(verifyUser, profileUpdate)
router.route("/admin/users").get(verifyUser, roleBasedAccess("admin") , getUsers)
router.route("/admin/user/:id").get(verifyUser, roleBasedAccess("admin") , getSingleUser).put(verifyUser, roleBasedAccess("admin"),updateUserRole).delete(verifyUser, roleBasedAccess("admin") , deleteUser)

export default router; 

  



