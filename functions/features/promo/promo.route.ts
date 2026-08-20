import { Router } from "express";
import PromoController from "./promo.controller";
import { uploadImage } from "../../middleware/upload";
import jwtAuth from "../../middleware/jwtAuth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     PromoRestaurantSummary:
 *       type: object
 *       description: Restaurant summary as populated on a promo
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d3"
 *         name:
 *           type: string
 *           example: Suya Spot
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/restaurants/suya-spot.jpg"
 *         state:
 *           type: string
 *           example: Rivers
 *     Promo:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d4"
 *         image:
 *           type: string
 *           description: URL to the promo image
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/promos/weekend-special.jpg"
 *         category:
 *           type: string
 *           description: Arbitrary grouping/category label
 *           example: Weekend Special
 *         restaurant:
 *           oneOf:
 *             - type: string
 *               description: Restaurant ObjectId
 *               example: "64f2a1b3c4d5e6f7a8b9c0d5"
 *             - $ref: '#/components/schemas/PromoRestaurantSummary'
 *         type:
 *           type: string
 *           enum: [freeDelivery, discount, bogo, cashback, other]
 *           example: discount
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-15T08:30:00.000Z"
 *     PromoListMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 18
 *         offset:
 *           type: integer
 *           example: 0
 *         limit:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /promo:
 *   post:
 *     summary: Create a promo
 *     description: >
 *       Creates a promo for a restaurant. Accepts an optional image upload (a URL must be supplied via other means if no file is attached, since image is required).
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/promo`
 *     tags: [Promos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [category, restaurant, type]
 *             properties:
 *               category:
 *                 type: string
 *               restaurant:
 *                 type: string
 *                 description: Restaurant ObjectId
 *               type:
 *                 type: string
 *                 enum: [freeDelivery, discount, bogo, cashback, other]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Promo created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Promo'
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
 *   get:
 *     summary: List promos
 *     description: >
 *       Public endpoint to list promos, optionally filtered by category, type and restaurant.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/promo`
 *     tags: [Promos]
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [freeDelivery, discount, bogo, cashback, other]
 *       - in: query
 *         name: restaurant
 *         schema:
 *           type: string
 *         description: Filter by restaurant ObjectId
 *     responses:
 *       200:
 *         description: List of promos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promo'
 *                 meta:
 *                   $ref: '#/components/schemas/PromoListMeta'
 */
router.post("/", jwtAuth, uploadImage.single("image"), PromoController.create);

router.get("/", PromoController.get);

/**
 * @swagger
 * /promo/restaurant/{restaurantId}:
 *   get:
 *     summary: List promos for a restaurant
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/promo/restaurant/{restaurantId}`
 *     tags: [Promos]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of promos for the restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promo'
 *                 meta:
 *                   $ref: '#/components/schemas/PromoListMeta'
 */
router.get("/restaurant/:restaurantId", PromoController.getByRestaurant);

/**
 * @swagger
 * /promo/{id}:
 *   get:
 *     summary: Get a promo by ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/promo/{id}`
 *     tags: [Promos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The promo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Promo'
 *       404:
 *         description: Promo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update a promo
 *     description: >
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/promo/{id}`
 *     tags: [Promos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *               restaurant:
 *                 type: string
 *                 description: Restaurant ObjectId
 *               type:
 *                 type: string
 *                 enum: [freeDelivery, discount, bogo, cashback, other]
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated promo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Promo'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Promo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a promo
 *     description: >
 *       Deletes a promo and its associated image.
 *
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/promo/{id}`
 *     tags: [Promos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promo deleted
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
 *                   example: Promo deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Promo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", PromoController.getById);

router.put("/:id", jwtAuth, PromoController.update);

/**
 * @swagger
 * /promo/{id}/image:
 *   patch:
 *     summary: Update a promo's image
 *     description: >
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/promo/{id}/image`
 *     tags: [Promos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Promo image updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Promo'
 *                 message:
 *                   type: string
 *                   example: Promo image updated
 *       400:
 *         description: No image file uploaded
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
 *         description: Promo not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  "/:id/image",
  jwtAuth,
  uploadImage.single("image"),
  PromoController.updateImage
);

router.delete("/:id", jwtAuth, PromoController.delete);

export default router;
