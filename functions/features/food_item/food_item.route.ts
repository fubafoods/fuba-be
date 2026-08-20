import { Router } from 'express';
import FoodItemController from './food_item.controller';
import { uploadImage } from '../../middleware/upload';
import jwtAuth from '../../middleware/jwtAuth';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodItemPrice:
 *       type: object
 *       properties:
 *         premium:
 *           type: number
 *           example: 4500
 *         executive:
 *           type: number
 *           example: 3500
 *         regular:
 *           type: number
 *           example: 2500
 *     FoodItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         name:
 *           type: string
 *           example: Jollof Rice with Grilled Chicken
 *         description:
 *           type: string
 *           example: Smoky party-style jollof rice served with grilled chicken and fried plantain
 *         price:
 *           $ref: '#/components/schemas/FoodItemPrice'
 *         vendor:
 *           type: string
 *           nullable: true
 *           description: Vendor (User) ObjectId. Omitted/null for Home Chef items not tied to a vendor.
 *           example: "64f2a1b3c4d5e6f7a8b9c0d2"
 *         image:
 *           type: string
 *           description: Cloudinary URL of the food item image
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/food-items/jollof-rice.jpg"
 *         category:
 *           type: array
 *           items:
 *             type: string
 *           description: List of category names
 *           example: ["Rice Dishes", "Party Food"]
 *         available:
 *           type: boolean
 *           default: true
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-05T14:30:00.000Z"
 *     FoodItemListMeta:
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
 * /food-item:
 *   post:
 *     summary: Create a food item
 *     description: >
 *       Creates a food item. Accepts an optional image upload as multipart/form-data.
 *       Any `vendor` field submitted by the client is ignored/stripped so items can be
 *       created as unassigned "Home Chef" items. Because this endpoint accepts
 *       multipart/form-data, nested `price` fields must be sent using dot-notation
 *       keys (`price.premium`, `price.executive`, `price.regular`).
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/food-item`
 *     tags: [Food Items]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, 'price.premium', 'price.executive', 'price.regular']
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price.premium:
 *                 type: number
 *               price.executive:
 *                 type: number
 *               price.regular:
 *                 type: number
 *               category:
 *                 type: string
 *                 description: Comma-separated list, JSON array string, or repeated field of category names
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Food item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodItem'
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
 *     summary: List food items
 *     description: >
 *       Public endpoint to list food items with optional search and category filters.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-item`
 *     tags: [Food Items]
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
 *         description: Case-insensitive search on food item name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Comma-separated list or JSON array string of category names to filter by (case-insensitive)
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Alias for `category`
 *     responses:
 *       200:
 *         description: List of food items
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
 *                     $ref: '#/components/schemas/FoodItem'
 *                 meta:
 *                   $ref: '#/components/schemas/FoodItemListMeta'
 */
// Create a food item (with optional image)
router.post('/', jwtAuth, uploadImage.single('image'), FoodItemController.create);

// Get all food items (with optional query)
router.get('/', FoodItemController.get);

/**
 * @swagger
 * /food-item/vendor/{vendorId}:
 *   get:
 *     summary: Get food items by vendor ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-item/vendor/{vendorId}`
 *     tags: [Food Items]
 *     parameters:
 *       - in: path
 *         name: vendorId
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
 *         description: List of the vendor's food items
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
 *                     $ref: '#/components/schemas/FoodItem'
 *                 meta:
 *                   $ref: '#/components/schemas/FoodItemListMeta'
 */
// Get food items by vendor
router.get('/vendor/:vendorId', FoodItemController.getByVendor);

/**
 * @swagger
 * /food-item/{id}:
 *   get:
 *     summary: Get a food item by ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-item/{id}`
 *     tags: [Food Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The food item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodItem'
 *       404:
 *         description: Food item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update a food item
 *     description: >
 *       Updates a food item by ID. Any `vendor` field submitted by the client is
 *       ignored/stripped. Sent as a JSON body (no image upload on this endpoint;
 *       use PATCH /food-item/{id}/image to change the image).
 *
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/food-item/{id}`
 *     tags: [Food Items]
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
 *               description:
 *                 type: string
 *               price:
 *                 $ref: '#/components/schemas/FoodItemPrice'
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated food item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Food item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a food item
 *     description: >
 *       Deletes a food item (and its uploaded image on Cloudinary, if any).
 *
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/food-item/{id}`
 *     tags: [Food Items]
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
 *         description: Food item deleted
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
 *                   example: Food item deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Food item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get a food item by ID
router.get('/:id', FoodItemController.getById);

// Update a food item by ID
router.put('/:id', jwtAuth, FoodItemController.update);

/**
 * @swagger
 * /food-item/{id}/image:
 *   patch:
 *     summary: Update a food item's image
 *     description: >
 *       Replaces the image for a food item.
 *
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/food-item/{id}/image`
 *     tags: [Food Items]
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
 *         description: Food item image updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodItem'
 *                 message:
 *                   type: string
 *                   example: Food item image updated successfully
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
 *         description: Food item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Update food item image
router.patch('/:id/image', jwtAuth, uploadImage.single('image'), FoodItemController.updateImage);

// Toggle food item availability
// router.patch('/:id/availability', FoodItemController.toggleAvailability);

// Delete a food item by ID
router.delete('/:id', jwtAuth, FoodItemController.delete);

export default router;
