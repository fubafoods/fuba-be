import * as express from 'express';
import AuthController from './auth.controller';
import VendorAuthController from './vendor.auth.controller';
import jwtAuth from '../../middleware/jwtAuth';
import { upload } from '../../middleware/upload';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     VendorOperatingHours:
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
 *     VendorProfile:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         brand_name:
 *           type: string
 *         brand_category:
 *           type: string
 *         brand_description:
 *           type: string
 *         brand_image:
 *           type: string
 *         brand_cover_image:
 *           type: string
 *         business_email:
 *           type: string
 *         business_phone:
 *           type: string
 *         brand_address:
 *           type: string
 *         state:
 *           type: string
 *         operating_hours:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VendorOperatingHours'
 *         delivery_type:
 *           type: string
 *           enum: [pickup, delivery, both]
 *         brand_registration_number:
 *           type: string
 *         cac_certificate:
 *           type: string
 *         nafdac_status:
 *           type: string
 *           enum: [not_requested, pending, paid, uploaded, approved, rejected]
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 */

/**
 * @swagger
 * /api/auth/vendor/check-area:
 *   post:
 *     summary: Check whether a state/address is within an available delivery area
 *     tags: [Auth - Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [state, brand_address]
 *             properties:
 *               state:
 *                 type: string
 *               brand_address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Availability result
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
 *                     available:
 *                       type: boolean
 *                 message:
 *                   type: string
 */
router.post('/check-area', VendorAuthController.checkArea);

/**
 * @swagger
 * /api/auth/vendor/waitlist:
 *   post:
 *     summary: Join the vendor waitlist for an unavailable area
 *     tags: [Auth - Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, state]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phone_number:
 *                 type: string
 *               state:
 *                 type: string
 *               brand_address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Added to waitlist
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
 *         description: Already on the waitlist / validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/waitlist', VendorAuthController.joinWaitlist);

/**
 * @swagger
 * /api/auth/vendor/initiate-verification:
 *   post:
 *     summary: Start vendor email verification (sends an OTP)
 *     tags: [Auth - Vendor]
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
router.post('/initiate-verification', VendorAuthController.initiateVerification);

/**
 * @swagger
 * /api/auth/vendor/verify:
 *   post:
 *     summary: Verify the vendor email OTP
 *     tags: [Auth - Vendor]
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
router.post('/verify', VendorAuthController.verifyOtp);

/**
 * @swagger
 * /api/auth/vendor/register:
 *   post:
 *     summary: Complete vendor registration
 *     description: Finishes vendor signup using the verification_token from /verify. Accepts optional brand logo/cover images and a CAC certificate document.
 *     tags: [Auth - Vendor]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [verification_token, first_name, last_name, phone_number, password, brand_name]
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
 *               brand_description:
 *                 type: string
 *               state:
 *                 type: string
 *               brand_address:
 *                 type: string
 *               operating_hours:
 *                 type: string
 *                 description: JSON-encoded array of VendorOperatingHours
 *               delivery_type:
 *                 type: string
 *                 enum: [pickup, delivery, both]
 *               brand_registration_number:
 *                 type: string
 *               brand_logo:
 *                 type: string
 *                 format: binary
 *               brand_cover:
 *                 type: string
 *                 format: binary
 *               cac_certificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vendor registration completed
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
 *                     vendor_profile:
 *                       $ref: '#/components/schemas/VendorProfile'
 *                 message:
 *                   type: string
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
        { name: 'brand_cover', maxCount: 1 },
        { name: 'cac_certificate', maxCount: 1 }
    ]),
    VendorAuthController.register
);

/**
 * @swagger
 * /api/auth/vendor/nafdac-request:
 *   post:
 *     summary: Request a NAFDAC seal for the authenticated vendor's brand
 *     tags: [Auth - Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [brand_name, business_email, brand_address, brand_phone]
 *             properties:
 *               brand_name:
 *                 type: string
 *               business_email:
 *                 type: string
 *                 format: email
 *               brand_address:
 *                 type: string
 *               brand_phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: NAFDAC seal requested; may include a payment URL/reference
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
 *                     payment_url:
 *                       type: string
 *                     payment_reference:
 *                       type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/nafdac-request', jwtAuth, VendorAuthController.requestNafdacSeal);

/**
 * @swagger
 * /api/auth/vendor/nafdac-verify-payment:
 *   post:
 *     summary: Verify payment for a NAFDAC seal request
 *     tags: [Auth - Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [payment_reference]
 *             properties:
 *               payment_reference:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verification result
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
 *                 message:
 *                   type: string
 *       400:
 *         description: Payment not verified / invalid reference
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
router.post('/nafdac-verify-payment', jwtAuth, VendorAuthController.verifyNafdacPayment);

/**
 * @swagger
 * /api/auth/vendor/nafdac-upload:
 *   post:
 *     summary: Upload the NAFDAC seal document for the authenticated vendor
 *     tags: [Auth - Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [brand_name, brand_email, brand_address, nafdac_seal]
 *             properties:
 *               brand_name:
 *                 type: string
 *               brand_email:
 *                 type: string
 *                 format: email
 *               brand_address:
 *                 type: string
 *               nafdac_seal:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: NAFDAC seal uploaded
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
 *                 message:
 *                   type: string
 *       400:
 *         description: NAFDAC seal file is required
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
router.post(
    '/nafdac-upload',
    jwtAuth,
    upload.single('nafdac_seal'),
    VendorAuthController.uploadNafdacSeal
);

/**
 * @swagger
 * /api/auth/vendor/login:
 *   post:
 *     summary: Log in as a vendor
 *     tags: [Auth - Vendor]
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
 * /api/auth/vendor/request-otp:
 *   post:
 *     summary: Request a password-reset OTP
 *     tags: [Auth - Vendor]
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
 * /api/auth/vendor/verify-otp:
 *   post:
 *     summary: Verify a password-reset OTP
 *     tags: [Auth - Vendor]
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
 * /api/auth/vendor/reset-password:
 *   post:
 *     summary: Set a new password using a verified OTP
 *     tags: [Auth - Vendor]
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
 * /api/auth/vendor/change-password:
 *   post:
 *     summary: Change the authenticated vendor's password
 *     tags: [Auth - Vendor]
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
