import * as express from 'express';

// Extend Express Request type to include user with roles
declare global {
  namespace Express {
    interface User {
      id: string;
    }
    interface Request {
      user?: User;
    }
  }
}

import UserController from './user.controller';
import jwtAuth from '../../middleware/jwtAuth';
import { uploadImage, uploadImageFlexible } from '../../middleware/upload';

const router = express.Router();

router.use(jwtAuth)

router.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         email:
 *           type: string
 *           format: email
 *           example: "ada.okafor@example.com"
 *         username:
 *           type: string
 *           example: "ada_okafor"
 *         phone_number:
 *           type: string
 *           example: "+2348012345678"
 *         role:
 *           type: string
 *           enum: [consumer, vendor, luxury_restaurant, admin]
 *           example: consumer
 *         service_type:
 *           type: string
 *           enum: [food_vendor, luxury_restaurant]
 *           example: food_vendor
 *         first_name:
 *           type: string
 *           example: "Ada"
 *         last_name:
 *           type: string
 *           example: "Okafor"
 *         full_name:
 *           type: string
 *           description: Virtual property derived from first_name and last_name
 *           example: "Ada Okafor"
 *         profile_picture:
 *           type: string
 *           description: Cloudinary URL of the user's profile picture
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/profiles/ada-okafor.jpg"
 *         verified:
 *           type: boolean
 *           example: true
 *         mapLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               example: 6.5244
 *             longitude:
 *               type: number
 *               example: 3.3792
 *         favoriteRestaurants:
 *           type: array
 *           items:
 *             type: string
 *             example: "64f2a1b3c4d5e6f7a8b9c0d2"
 *           description: Restaurant ObjectIds
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-05T14:30:00.000Z"
 *     UserProfileSummary:
 *       type: object
 *       description: Trimmed user representation returned by profile-picture and details update endpoints.
 *       properties:
 *         id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         email:
 *           type: string
 *           format: email
 *           example: "ada.okafor@example.com"
 *         full_name:
 *           type: string
 *           example: "Ada Okafor"
 *         profile_picture:
 *           type: string
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/profiles/ada-okafor.jpg"
 *         first_name:
 *           type: string
 *           example: "Ada"
 *         last_name:
 *           type: string
 *           example: "Okafor"
 *         role:
 *           type: string
 *           enum: [consumer, vendor, luxury_restaurant, admin]
 *           example: consumer
 *     UserUpdateProfileInput:
 *       type: object
 *       description: Partial set of profile fields to update.
 *       properties:
 *         first_name:
 *           type: string
 *           example: "Ada"
 *         last_name:
 *           type: string
 *           example: "Okafor"
 *         username:
 *           type: string
 *           example: "ada_okafor"
 *         phone_number:
 *           type: string
 *           example: "+2348012345678"
 *         service_type:
 *           type: string
 *           enum: [food_vendor, luxury_restaurant]
 *           example: food_vendor
 *         mapLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *               example: 6.5244
 *             longitude:
 *               type: number
 *               example: 3.3792
 *         favoriteRestaurants:
 *           type: array
 *           items:
 *             type: string
 *             example: "64f2a1b3c4d5e6f7a8b9c0d2"
 *         settings:
 *           type: string
 *           example: "dark_mode_enabled"
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: >
 *       Fetches a user document by its ID. Requires a valid Bearer token.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/user/{userId}`
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.get('/:userId', UserController.getUserById);

/**
 * @swagger
 * /user/profile/{userId}:
 *   get:
 *     summary: Get a user's profile
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/user/profile/{userId}`
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update a user's profile
 *     description: >
 *       Partially updates profile fields for the given user.
 *
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/user/profile/{userId}`
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   patch:
 *     summary: Update a user's password
 *     description: >
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/user/profile/{userId}`
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword]
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password Changed Successfully
 *       400:
 *         description: Invalid old password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile/:userId', UserController.getProfile);
router.put('/profile/:userId', UserController.updateProfile);
router.patch('/profile/:userId', UserController.updatePassword);

/**
 * @swagger
 * /user/profile/{userId}/profile-picture:
 *   patch:
 *     summary: Update a user's profile picture
 *     description: >
 *       Updates the user's profile picture. Accepts either a multipart image
 *       upload (field name `image`) or a JSON body with an `imageUrl`. If a
 *       file is provided it takes precedence; otherwise `imageUrl` is used.
 *
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/user/profile/{userId}/profile-picture`
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (jpeg, png, gif, webp, svg; max 5MB)
 *               imageUrl:
 *                 type: string
 *                 description: Fallback image URL used only if no file is uploaded
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileSummary'
 *                 message:
 *                   type: string
 *                   example: Profile picture updated successfully
 *       400:
 *         description: No image file or imageUrl provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/profile/:userId/profile-picture',
  uploadImage.single('image'),
  UserController.updateProfilePicture
);

/**
 * @swagger
 * /user/profile/{userId}/details:
 *   patch:
 *     summary: Update user details (with optional profile picture)
 *     description: >
 *       Updates profile fields and optionally replaces the profile picture in
 *       a single request. Accepts multipart form data (any field name may
 *       carry the image file, e.g. `image`) or a plain JSON body with no file.
 *
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/user/profile/{userId}/details`
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/UserUpdateProfileInput'
 *               - type: object
 *                 properties:
 *                   image:
 *                     type: string
 *                     format: binary
 *                     description: Optional profile picture file (jpeg, png, gif, webp, svg; max 5MB)
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateProfileInput'
 *     responses:
 *       200:
 *         description: User details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfileSummary'
 *                 message:
 *                   type: string
 *                   example: User details updated successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Update user details including optional profile picture
router.patch(
  '/profile/:userId/details',
  uploadImageFlexible,
  UserController.updateDetails
);

export default router;
