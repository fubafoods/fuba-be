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
 *         email:
 *           type: string
 *           format: email
 *         username:
 *           type: string
 *         phone_number:
 *           type: string
 *         role:
 *           type: string
 *           enum: [consumer, vendor, luxury_restaurant, admin]
 *         service_type:
 *           type: string
 *           enum: [food_vendor, luxury_restaurant]
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         full_name:
 *           type: string
 *           description: Virtual property derived from first_name and last_name
 *         profile_picture:
 *           type: string
 *           description: Cloudinary URL of the user's profile picture
 *         verified:
 *           type: boolean
 *         mapLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         favoriteRestaurants:
 *           type: array
 *           items:
 *             type: string
 *           description: Restaurant ObjectIds
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     UserProfileSummary:
 *       type: object
 *       description: Trimmed user representation returned by profile-picture and details update endpoints.
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         full_name:
 *           type: string
 *         profile_picture:
 *           type: string
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         role:
 *           type: string
 *           enum: [consumer, vendor, luxury_restaurant, admin]
 *     UserUpdateProfileInput:
 *       type: object
 *       description: Partial set of profile fields to update.
 *       properties:
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         username:
 *           type: string
 *         phone_number:
 *           type: string
 *         service_type:
 *           type: string
 *           enum: [food_vendor, luxury_restaurant]
 *         mapLocation:
 *           type: object
 *           properties:
 *             latitude:
 *               type: number
 *             longitude:
 *               type: number
 *         favoriteRestaurants:
 *           type: array
 *           items:
 *             type: string
 *         settings:
 *           type: string
 */

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Fetches a user document by its ID. Requires a valid Bearer token.
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
 * /api/user/profile/{userId}:
 *   get:
 *     summary: Get a user's profile
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
 *     description: Partially updates profile fields for the given user.
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
 * /api/user/profile/{userId}/profile-picture:
 *   patch:
 *     summary: Update a user's profile picture
 *     description: >
 *       Updates the user's profile picture. Accepts either a multipart image
 *       upload (field name `image`) or a JSON body with an `imageUrl`. If a
 *       file is provided it takes precedence; otherwise `imageUrl` is used.
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
 * /api/user/profile/{userId}/details:
 *   patch:
 *     summary: Update user details (with optional profile picture)
 *     description: >
 *       Updates profile fields and optionally replaces the profile picture in
 *       a single request. Accepts multipart form data (any field name may
 *       carry the image file, e.g. `image`) or a plain JSON body with no file.
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
