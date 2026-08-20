import * as express from 'express';
import AuthController from './auth.controller';
import RestaurantAuthController from './restaurant.auth.controller';
import { upload } from '../../middleware/upload';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RestaurantOperatingHours:
 *       type: object
 *       properties:
 *         day:
 *           type: string
 *         open_hour:
 *           type: integer
 *         open_minute:
 *           type: integer
 *         close_hour:
 *           type: integer
 *         close_minute:
 *           type: integer
 *     RestaurantApplication:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         brand_name:
 *           type: string
 *         brand_category:
 *           type: string
 *         brand_address:
 *           type: string
 *         operating_hours:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RestaurantOperatingHours'
 *         delivery_type:
 *           type: string
 *           enum: [pickup, delivery, both]
 *         brand_logo:
 *           type: string
 *         cover_image:
 *           type: string
 *         brand_registration_number:
 *           type: string
 *         cac_certificate:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending_review, approved, rejected]
 */

/**
 * @swagger
 * /api/auth/restaurant/initiate-verification:
 *   post:
 *     summary: Start restaurant email verification (sends an OTP)
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification OTP sent
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
 */
router.post('/initiate-verification', RestaurantAuthController.initiateVerification);

/**
 * @swagger
 * /api/auth/restaurant/verify:
 *   post:
 *     summary: Verify the restaurant email OTP
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified, returns a verification_token used to complete registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     verification_token:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/verify', RestaurantAuthController.verifyOtp);

/**
 * @swagger
 * /api/auth/restaurant/resend-otp:
 *   post:
 *     summary: Resend the restaurant email verification OTP
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP resent
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
 */
router.post('/resend-otp', RestaurantAuthController.resendOtp);

/**
 * @swagger
 * /api/auth/restaurant/register:
 *   post:
 *     summary: Submit a restaurant application
 *     description: Completes restaurant signup using the verification_token from /verify. Submits the application for review. Accepts optional brand logo/cover images and a CAC certificate document.
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [verification_token, first_name, last_name, phone_number, password, brand_name, brand_category, brand_address, operating_hours, delivery_type, brand_registration_number]
 *             properties:
 *               verification_token:
 *                 type: string
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               brand_name:
 *                 type: string
 *               brand_category:
 *                 type: string
 *               brand_address:
 *                 type: string
 *               operating_hours:
 *                 type: string
 *                 description: JSON-encoded array of RestaurantOperatingHours
 *               delivery_type:
 *                 type: string
 *                 enum: [pickup, delivery, both]
 *               brand_registration_number:
 *                 type: string
 *               brand_logo:
 *                 type: string
 *                 format: binary
 *               cover_image:
 *                 type: string
 *                 format: binary
 *               cac_certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Application submitted for review
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       $ref: '#/components/schemas/AuthUser'
 *                     application:
 *                       $ref: '#/components/schemas/RestaurantApplication'
 *                 message:
 *                   type: string
 *                   example: Restaurant registration submitted for review.
 *       400:
 *         description: Validation error or invalid/expired verification token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
    '/register',
    upload.fields([
        { name: 'brand_logo', maxCount: 1 },
        { name: 'cover_image', maxCount: 1 },
        { name: 'cac_certificate', maxCount: 1 }
    ]),
    RestaurantAuthController.register
);

/**
 * @swagger
 * /api/auth/restaurant/login:
 *   post:
 *     summary: Log in as a restaurant
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokenData'
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/restaurant/request-otp:
 *   post:
 *     summary: Request a password-reset OTP
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: OTP generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     otp:
 *                       type: string
 *                 message:
 *                   type: string
 */
router.post('/request-otp', AuthController.requestOTP);

/**
 * @swagger
 * /api/auth/restaurant/verify-otp:
 *   post:
 *     summary: Verify a password-reset OTP
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokenData'
 *                 message:
 *                   type: string
 *                   example: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/verify-otp', AuthController.verifyOTP);

/**
 * @swagger
 * /api/auth/restaurant/reset-password:
 *   post:
 *     summary: Set a new password using a verified OTP
 *     tags: [Auth - Restaurant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, new_password, confirm_password, otp]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               new_password:
 *                 type: string
 *                 format: password
 *               confirm_password:
 *                 type: string
 *                 format: password
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AuthTokenData'
 *                 message:
 *                   type: string
 *                   example: New Password Changed Successfully
 *       400:
 *         description: Invalid OTP, or new_password/confirm_password mismatch
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset-password', AuthController.newPassword);

/**
 * @swagger
 * /api/auth/restaurant/change-password:
 *   post:
 *     summary: Change the authenticated restaurant user's password
 *     tags: [Auth - Restaurant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed
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
 *                   example: Password changed successfully
 *       400:
 *         description: Current password is incorrect
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
 */
router.post('/change-password', AuthController.changePassword);

export default router;
