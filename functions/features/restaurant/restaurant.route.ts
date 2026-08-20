import { Router } from "express";
import RestaurantController from "./restaurant.controller";
import jwtAuth from '../../middleware/jwtAuth';
import { uploadImage } from '../../middleware/upload';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     RestaurantPromo:
 *       type: object
 *       properties:
 *         freeDelivery:
 *           type: boolean
 *           example: true
 *         discountPercentage:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           example: 15
 *     RestaurantMapLocation:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [Point]
 *           example: Point
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           description: "[longitude, latitude]"
 *           example: [7.0498, 4.8156]
 *     RestaurantMenuItem:
 *       type: object
 *       description: Food item summary as populated on a restaurant's items list
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         name:
 *           type: string
 *           example: Jollof Rice Special
 *         category:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Rice", "Nigerian"]
 *         description:
 *           type: string
 *           example: Smoky party jollof rice served with fried plantain and grilled chicken
 *         price:
 *           type: object
 *           properties:
 *             premium:
 *               type: number
 *               example: 4500
 *             executive:
 *               type: number
 *               example: 3500
 *             regular:
 *               type: number
 *               example: 2500
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/items/jollof-rice-special.jpg"
 *     Restaurant:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d2"
 *         name:
 *           type: string
 *           example: The Grill House
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/restaurants/grill-house.jpg"
 *         coverImage:
 *           type: string
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/restaurants/grill-house-cover.jpg"
 *         street:
 *           type: string
 *           example: 12 Aba Road, Port Harcourt
 *         state:
 *           type: string
 *           example: Rivers
 *         isFavorite:
 *           type: boolean
 *           example: false
 *         mode:
 *           type: string
 *           enum: [delivery, pickup, both]
 *           example: both
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RestaurantMenuItem'
 *         openTime:
 *           type: string
 *           description: "Format HH:mm, e.g. 09:00"
 *           example: "09:00"
 *         closeTime:
 *           type: string
 *           description: "Format HH:mm, e.g. 22:00"
 *           example: "22:00"
 *         ratings:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *         mapLocation:
 *           $ref: '#/components/schemas/RestaurantMapLocation'
 *         promo:
 *           $ref: '#/components/schemas/RestaurantPromo'
 *         distanceKm:
 *           type: number
 *           description: Distance from the requested mapLocation, in kilometers (only present when the mapLocation query parameter is used)
 *           example: 3.2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-15T08:30:00.000Z"
 *     RestaurantListMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 42
 *         offset:
 *           type: integer
 *           example: 0
 *         limit:
 *           type: integer
 *           example: 10
 */

/**
 * @swagger
 * /restaurant:
 *   post:
 *     summary: Create a restaurant
 *     description: >
 *       Creates a restaurant. Accepts an optional image upload.
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/restaurant`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               street:
 *                 type: string
 *               state:
 *                 type: string
 *               mode:
 *                 type: string
 *                 enum: [delivery, pickup, both]
 *                 default: both
 *               openTime:
 *                 type: string
 *                 description: "Format HH:mm, e.g. 09:00"
 *               closeTime:
 *                 type: string
 *                 description: "Format HH:mm, e.g. 22:00"
 *               "promo.freeDelivery":
 *                 type: boolean
 *               "promo.discountPercentage":
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Restaurant created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
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
 *     summary: List restaurants
 *     description: >
 *       Retrieves restaurants with optional search, promo, favorite and map-location filters, with pagination.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/restaurant`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Case-insensitive search on restaurant name
 *       - in: query
 *         name: promo
 *         schema:
 *           type: string
 *         description: "Filter by promo: 'freeDelivery', 'discount', 'any'/'true'/'1', or 'false'/'0'"
 *       - in: query
 *         name: mapLocation
 *         schema:
 *           type: string
 *         description: "Filter/sort by location as 'latitude,longitude,radiusKm' (radius defaults to 10km)"
 *       - in: query
 *         name: favourite
 *         schema:
 *           type: boolean
 *         description: "Filter by favorite status (alias: favorite)"
 *     responses:
 *       200:
 *         description: List of restaurants
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
 *                     $ref: '#/components/schemas/Restaurant'
 *                 meta:
 *                   $ref: '#/components/schemas/RestaurantListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", jwtAuth, uploadImage.single("image"), RestaurantController.create);
router.get("/", jwtAuth, RestaurantController.get);

/**
 * @swagger
 * /restaurant/promos/active:
 *   get:
 *     summary: List restaurants with active promotions
 *     description: >
 *       Retrieves restaurants that currently offer free delivery.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/restaurant/promos/active`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: List of restaurants with active promos
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
 *                     $ref: '#/components/schemas/Restaurant'
 *                 meta:
 *                   $ref: '#/components/schemas/RestaurantListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/promos/active", jwtAuth, RestaurantController.getWithPromos);

/**
 * @swagger
 * /restaurant/mode/{mode}:
 *   get:
 *     summary: List restaurants by mode
 *     description: >
 *       Retrieves restaurants filtered by service mode.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/restaurant/mode/{mode}`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mode
 *         required: true
 *         schema:
 *           type: string
 *           enum: [delivery, pickup, both]
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
 *         description: List of restaurants
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
 *                     $ref: '#/components/schemas/Restaurant'
 *                 meta:
 *                   $ref: '#/components/schemas/RestaurantListMeta'
 *       400:
 *         description: Invalid mode
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
router.get("/mode/:mode", jwtAuth, RestaurantController.getByMode);

/**
 * @swagger
 * /restaurant/state/{state}:
 *   get:
 *     summary: List restaurants by state
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/restaurant/state/{state}`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: state
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
 *         description: List of restaurants
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
 *                     $ref: '#/components/schemas/Restaurant'
 *                 meta:
 *                   $ref: '#/components/schemas/RestaurantListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/state/:state", jwtAuth, RestaurantController.getByState);

/**
 * @swagger
 * /restaurant/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     description: >
 *       Retrieves a restaurant, optionally filtering its items by search and applying promo/map-location filters.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/restaurant/{id}`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search within the restaurant's items by name
 *       - in: query
 *         name: promo
 *         schema:
 *           type: string
 *         description: "Filter by promo: 'freeDelivery', 'discount', 'any'/'true'/'1', or 'false'/'0'"
 *       - in: query
 *         name: mapLocation
 *         schema:
 *           type: string
 *         description: "'latitude,longitude,radiusKm' — adds distanceKm to the response"
 *     responses:
 *       200:
 *         description: The restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update a restaurant
 *     description: >
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/restaurant/{id}`
 *     tags: [Restaurants]
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
 *               name:
 *                 type: string
 *               street:
 *                 type: string
 *               state:
 *                 type: string
 *               mode:
 *                 type: string
 *                 enum: [delivery, pickup, both]
 *               openTime:
 *                 type: string
 *               closeTime:
 *                 type: string
 *               promo:
 *                 $ref: '#/components/schemas/RestaurantPromo'
 *               mapLocation:
 *                 $ref: '#/components/schemas/RestaurantMapLocation'
 *     responses:
 *       200:
 *         description: Updated restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a restaurant
 *     description: >
 *       Deletes a restaurant and its associated image.
 *
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/restaurant/{id}`
 *     tags: [Restaurants]
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
 *         description: Restaurant deleted
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
 *                   example: Restaurant deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", jwtAuth, RestaurantController.getById);

router.put("/:id", jwtAuth, RestaurantController.update);

/**
 * @swagger
 * /restaurant/{id}/image:
 *   patch:
 *     summary: Update a restaurant's image
 *     description: >
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/restaurant/{id}/image`
 *     tags: [Restaurants]
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
 *         description: Restaurant image updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: Restaurant image updated successfully
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
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/image", jwtAuth, uploadImage.single("image"), RestaurantController.updateImage);

/**
 * @swagger
 * /restaurant/{id}/rating:
 *   patch:
 *     summary: Update a restaurant's rating
 *     description: >
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/restaurant/{id}/rating`
 *     tags: [Restaurants]
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
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: Rating updated successfully
 *       400:
 *         description: Rating missing or out of range (0-5)
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
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/rating", jwtAuth, RestaurantController.updateRating);

/**
 * @swagger
 * /restaurant/items/add:
 *   post:
 *     summary: Add an item to a restaurant
 *     description: >
 *       Links an existing food item to a restaurant when `itemId` is provided, or creates a new
 *       food item from the given payload (optionally with an image) and links it. Provide either
 *       `itemId`, or an `item` object / top-level item fields (name, description, category, price).
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/restaurant/items/add`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [restaurantId]
 *             properties:
 *               restaurantId:
 *                 type: string
 *               itemId:
 *                 type: string
 *                 description: ID of an existing food item to link (Path A)
 *               name:
 *                 type: string
 *                 description: New item's name (Path B, when itemId is not provided)
 *               description:
 *                 type: string
 *                 description: New item's description (Path B)
 *               category:
 *                 type: string
 *                 description: Comma-separated or JSON-encoded array of category names (Path B)
 *               price:
 *                 type: string
 *                 description: >
 *                   New item's price as a single number (applied to all tiers) or a JSON object
 *                   { "premium": number, "executive": number, "regular": number } (Path B)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image for a newly created item (Path B)
 *     responses:
 *       200:
 *         description: Existing item linked to restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: Item added to restaurant
 *       201:
 *         description: New item created and added to restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: New item created and added to restaurant
 *       400:
 *         description: Missing restaurantId, missing required item fields, or neither itemId nor item payload provided
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
 *         description: Restaurant or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/items/add", jwtAuth, uploadImage.single("image"), RestaurantController.addItem);

/**
 * @swagger
 * /restaurant/items/remove:
 *   post:
 *     summary: Remove an item from a restaurant
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/restaurant/items/remove`
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [restaurantId, itemId]
 *             properties:
 *               restaurantId:
 *                 type: string
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from restaurant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: Item removed from restaurant
 *       400:
 *         description: restaurantId and itemId are required
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
 *         description: Restaurant or item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/items/remove", jwtAuth, RestaurantController.removeItem);

router.delete("/:id", jwtAuth, RestaurantController.delete);

/**
 * @swagger
 * /restaurant/{id}/favorite:
 *   post:
 *     summary: Toggle favorite status for a restaurant
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/restaurant/{id}/favorite`
 *     tags: [Restaurants]
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
 *         description: Favorite status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Restaurant'
 *                 message:
 *                   type: string
 *                   example: Favorite status toggled successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:id/favorite", jwtAuth, RestaurantController.toggleFavorite);

export default router;
