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
 *         quantity:
 *           type: integer
 *           minimum: 1
 *     Meal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         vendor:
 *           type: string
 *           description: Vendor (User) ObjectId
 *         serviceType:
 *           type: string
 *           enum: [regular, premium, executive]
 *         category:
 *           type: string
 *           enum: [foreign, local]
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *         price:
 *           type: number
 *         priceDescription:
 *           type: string
 *         combo:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ComboItem'
 *         isInStock:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MealListMeta:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         offset:
 *           type: integer
 *         limit:
 *           type: integer
 */

/**
 * @swagger
 * /api/meal:
 *   post:
 *     summary: Create a meal
 *     description: Creates a meal for the authenticated vendor. Accepts an optional image upload.
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
 *     description: Public endpoint to list meals with optional search and filters.
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
 * /api/meal/my-meals:
 *   get:
 *     summary: Get the authenticated vendor's meals
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
 * /api/meal/vendor/{vendorId}:
 *   get:
 *     summary: Get meals by vendor ID
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
 * /api/meal/{id}:
 *   get:
 *     summary: Get a meal by ID
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
 *     description: Updates a meal. Only the owning vendor may update it. Image is optional.
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
 *     description: Deletes a meal (and its uploaded image). Only the owning vendor may delete it.
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
 * /api/meal/{id}/image:
 *   patch:
 *     summary: Update a meal's image
 *     description: Replaces the image for a meal. Only the owning vendor may update it.
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
 * /api/meal/{id}/stock:
 *   patch:
 *     summary: Toggle a meal's stock status
 *     description: Flips isInStock for a meal. Only the owning vendor may toggle it.
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
