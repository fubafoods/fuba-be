import * as express from 'express';
import AuthController from './auth.controller';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         first_name:
 *           type: string
 *           example: Ada
 *         last_name:
 *           type: string
 *           example: Okafor
 *         email:
 *           type: string
 *           example: ada.okafor@example.com
 *         phone_number:
 *           type: string
 *           example: "+2348012345678"
 *         role:
 *           type: string
 *           enum: [consumer, vendor, luxury_restaurant, admin]
 *           description: |
 *             The actor's account type. Note: this field uses "consumer" for the same actor
 *             type the auth routes call "customer" (see the Customer Auth tag description).
 *           example: consumer
 *         service_type:
 *           type: string
 *           enum: [food_vendor, luxury_restaurant]
 *           example: food_vendor
 *         verified:
 *           type: boolean
 *           example: true
 *     AuthTokenData:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjJhMWIzYzRkNWU2ZjdhOGI5YzBkMSJ9.4pQm3xW1sVh8y2kzT0bJH6f9Lc7dR2aXeK1nO3wYqEs"
 *         userId:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 */

/**
 * @swagger
 * /auth/customer/initiate-verification:
 *   post:
 *     summary: Start customer email verification (sends an OTP)
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/initiate-verification`
 *     tags: [Customer Auth]
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
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/initiate-verification', AuthController.initiateEmailVerification);

/**
 * @swagger
 * /auth/customer/verify-email:
 *   post:
 *     summary: Verify the OTP sent to a customer's email
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/verify-email`
 *     tags: [Customer Auth]
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
 *         description: Email verified, returns a short-lived verification token used to complete registration
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
router.post('/verify-email', AuthController.verifyEmail);

/**
 * @swagger
 * /auth/customer/register:
 *   post:
 *     summary: Complete customer registration
 *     description: >
 *       Finishes signup using the verification_token obtained from /verify-email.
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/register`
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [verification_token, first_name, last_name, phone_number, password, role]
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
 *               role:
 *                 type: string
 *                 enum: [consumer, vendor, luxury_restaurant, admin]
 *     responses:
 *       201:
 *         description: Registration completed
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
 *       400:
 *         description: Validation error or invalid/expired verification token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', AuthController.completeRegistration);

/**
 * @swagger
 * /auth/customer/resend-verification-email:
 *   post:
 *     summary: Resend the customer email verification OTP
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/resend-verification-email`
 *     tags: [Customer Auth]
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
 *         description: Verification email resent
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
 *                   example: Verification email resent
 */
router.post('/resend-verification-email', AuthController.resendVerificationEmail);

/**
 * @swagger
 * /auth/customer/login:
 *   post:
 *     summary: Log in as a customer
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/login`
 *     tags: [Customer Auth]
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
 * /auth/customer/google:
 *   post:
 *     summary: Sign up/in with a Google ID token
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/google`
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google sign-in successful
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
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid Google token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/google', AuthController.googleSignIn);

/**
 * @swagger
 * /auth/customer/google-login:
 *   post:
 *     summary: Log in with a Google ID token
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/google-login`
 *     tags: [Customer Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Google login successful
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
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid Google token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/google-login', AuthController.googleLogin);

/**
 * @swagger
 * /auth/customer/request-otp:
 *   post:
 *     summary: Request a password-reset OTP
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/request-otp`
 *     tags: [Customer Auth]
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
 * /auth/customer/verify-otp:
 *   post:
 *     summary: Verify a password-reset OTP
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/verify-otp`
 *     tags: [Customer Auth]
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
 * /auth/customer/reset-password:
 *   post:
 *     summary: Set a new password using a verified OTP
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/reset-password`
 *     tags: [Customer Auth]
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
 * /auth/customer/change-password:
 *   post:
 *     summary: Change the authenticated user's password
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/auth/customer/change-password`
 *     tags: [Customer Auth]
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
