import { Router } from "express";
import MealController from "./meal.controller";
import { uploadImage } from "../../middleware/upload";
import jwtAuth from "../../middleware/jwtAuth";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ComboItem:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Chilled Zobo Drink
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     Meal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         vendor:
 *           type: string
 *           description: Vendor (User) ObjectId
 *           example: "64f2a1b3c4d5e6f7a8b9c0d2"
 *         serviceType:
 *           type: string
 *           enum: [regular, premium, executive]
 *           example: premium
 *         category:
 *           type: string
 *           enum: [foreign, local]
 *           example: local
 *         name:
 *           type: string
 *           example: Jollof Rice & Grilled Chicken
 *         description:
 *           type: string
 *           example: Smoky party jollof rice served with grilled chicken and fried plantain.
 *         image:
 *           type: string
 *           example: "https://res.cloudinary.com/fuba/image/upload/v1700000000/meals/jollof-rice.jpg"
 *         price:
 *           type: number
 *           example: 4500
 *         priceDescription:
 *           type: string
 *           example: Per plate
 *         combo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComboItem'
 *         isInStock:
 *           type: boolean
 *           example: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-05T14:30:00.000Z"
 *     MealListMeta:
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
 * /meal:
 *   post:
 *     summary: Create a meal
 *     description: >
 *       Creates a meal for the authenticated vendor. Accepts an optional image upload.
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/meal`
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, description, price, serviceType, category]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               serviceType:
 *                 type: string
 *                 enum: [regular, premium, executive]
 *               category:
 *                 type: string
 *                 enum: [foreign, local]
 *               priceDescription:
 *                 type: string
 *               combo:
 *                 type: string
 *                 description: JSON-encoded array of { name, quantity } combo items
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Meal created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
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
 *     summary: List meals
 *     description: >
 *       Public endpoint to list meals with optional search and filters.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/meal`
 *     tags: [Meals]
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
 *         description: Case-insensitive search on meal name
 *       - in: query
 *         name: serviceType
 *         schema:
 *           type: string
 *           enum: [regular, premium, executive]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [foreign, local]
 *     responses:
 *       200:
 *         description: List of meals
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
 *                     $ref: '#/components/schemas/Meal'
 *                 meta:
 *                   $ref: '#/components/schemas/MealListMeta'
 */
router.post("/", jwtAuth, uploadImage.single("image"), MealController.create);
router.get("/", MealController.get);

/**
 * @swagger
 * /meal/my-meals:
 *   get:
 *     summary: Get the authenticated vendor's meals
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/meal/my-meals`
 *     tags: [Meals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of the vendor's meals
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
 *                     $ref: '#/components/schemas/Meal'
 *                 meta:
 *                   $ref: '#/components/schemas/MealListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/my-meals", jwtAuth, MealController.getMyMeals);

/**
 * @swagger
 * /meal/vendor/{vendorId}:
 *   get:
 *     summary: Get meals by vendor ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/meal/vendor/{vendorId}`
 *     tags: [Meals]
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of the vendor's meals
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
 *                     $ref: '#/components/schemas/Meal'
 *                 meta:
 *                   $ref: '#/components/schemas/MealListMeta'
 */
router.get("/vendor/:vendorId", MealController.getByVendor);

/**
 * @swagger
 * /meal/{id}:
 *   get:
 *     summary: Get a meal by ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/meal/{id}`
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The meal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update a meal
 *     description: >
 *       Updates a meal. Only the owning vendor may update it. Image is optional.
 *
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/meal/{id}`
 *     tags: [Meals]
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               serviceType:
 *                 type: string
 *                 enum: [regular, premium, executive]
 *               category:
 *                 type: string
 *                 enum: [foreign, local]
 *               priceDescription:
 *                 type: string
 *               combo:
 *                 type: string
 *                 description: JSON-encoded array of { name, quantity } combo items
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Updated meal
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
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
 *       403:
 *         description: Not authorized to update this meal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a meal
 *     description: >
 *       Deletes a meal (and its uploaded image). Only the owning vendor may delete it.
 *
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/meal/{id}`
 *     tags: [Meals]
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
 *         description: Meal deleted
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
 *                   example: Meal deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not authorized to delete this meal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", MealController.getById);
router.put("/:id", jwtAuth, uploadImage.single("image"), MealController.update);

/**
 * @swagger
 * /meal/{id}/image:
 *   patch:
 *     summary: Update a meal's image
 *     description: >
 *       Replaces the image for a meal. Only the owning vendor may update it.
 *
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/meal/{id}/image`
 *     tags: [Meals]
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
 *         description: Meal image updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *                 message:
 *                   type: string
 *                   example: Meal image updated successfully
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
 *       403:
 *         description: Not authorized to update this meal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/image", jwtAuth, uploadImage.single("image"), MealController.updateImage);

/**
 * @swagger
 * /meal/{id}/stock:
 *   patch:
 *     summary: Toggle a meal's stock status
 *     description: >
 *       Flips isInStock for a meal. Only the owning vendor may toggle it.
 *
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/meal/{id}/stock`
 *     tags: [Meals]
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
 *         description: Stock status toggled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Meal'
 *                 message:
 *                   type: string
 *                   example: Meal marked as in stock
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Not authorized to update this meal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/stock", jwtAuth, MealController.toggleStock);

router.delete("/:id", jwtAuth, MealController.deleteMeal);

export default router;
