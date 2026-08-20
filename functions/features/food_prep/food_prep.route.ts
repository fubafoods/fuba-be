import { Router } from 'express';
import FoodPrepController from './food_prep.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     FoodPrepMealItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         choiceOfMeal:
 *           type: string
 *           description: FoodItem ObjectId (may be populated with name, category, description, price, image)
 *         description:
 *           type: string
 *         note:
 *           type: string
 *         quantity:
 *           type: integer
 *         measurement:
 *           type: string
 *           enum: [litre, service]
 *         amount:
 *           type: number
 *           description: Amount to be charged for this meal item
 *     FoodPrep:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         consumer:
 *           type: string
 *           description: User (consumer) ObjectId, may be populated with name and email
 *         chefChoice:
 *           type: string
 *           description: Chef (User) ObjectId, may be populated with name and email
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *           default: pending
 *         mode:
 *           type: string
 *           enum: [delivery, pickup]
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *         address:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         meals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodPrepMealItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FoodPrepListMeta:
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
 * /api/food-prep:
 *   post:
 *     summary: Create a food preparation entry
 *     tags: [FoodPrep]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [consumer, chefChoice, mode, deliveryDate, address, phoneNumber, meals]
 *             properties:
 *               consumer:
 *                 type: string
 *                 description: User (consumer) ObjectId
 *               chefChoice:
 *                 type: string
 *                 description: Chef (User) ObjectId
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *                 default: pending
 *               mode:
 *                 type: string
 *                 enum: [delivery, pickup]
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               meals:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [choiceOfMeal, description, quantity, measurement, amount]
 *                   properties:
 *                     choiceOfMeal:
 *                       type: string
 *                       description: FoodItem ObjectId
 *                     description:
 *                       type: string
 *                     note:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     measurement:
 *                       type: string
 *                       enum: [litre, service]
 *                     amount:
 *                       type: number
 *     responses:
 *       201:
 *         description: Food preparation entry created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodPrep'
 *                 message:
 *                   type: string
 *                   example: Food preparation entry created successfully
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: List food preparation entries
 *     tags: [FoodPrep]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of food preparation entries
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
 *                     $ref: '#/components/schemas/FoodPrep'
 *                 meta:
 *                   $ref: '#/components/schemas/FoodPrepListMeta'
 */
// Create a food prep entry
router.post('/', FoodPrepController.create);

// Get all food prep entries (with optional query)
router.get('/', FoodPrepController.get);

/**
 * @swagger
 * /api/food-prep/status/{status}:
 *   get:
 *     summary: Get food preparation entries by status
 *     tags: [FoodPrep]
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of food preparation entries with the given status
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
 *                     $ref: '#/components/schemas/FoodPrep'
 *                 meta:
 *                   $ref: '#/components/schemas/FoodPrepListMeta'
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get food prep entries by status
router.get('/status/:status', FoodPrepController.getByStatus);

/**
 * @swagger
 * /api/food-prep/mode/{mode}:
 *   get:
 *     summary: Get food preparation entries by delivery mode
 *     tags: [FoodPrep]
 *     parameters:
 *       - in: path
 *         name: mode
 *         required: true
 *         schema:
 *           type: string
 *           enum: [delivery, pickup]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of food preparation entries with the given mode
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
 *                     $ref: '#/components/schemas/FoodPrep'
 *                 meta:
 *                   $ref: '#/components/schemas/FoodPrepListMeta'
 *       400:
 *         description: Invalid mode value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get food prep entries by mode
router.get('/mode/:mode', FoodPrepController.getByMode);

/**
 * @swagger
 * /api/food-prep/{id}:
 *   get:
 *     summary: Get a food preparation entry by ID
 *     tags: [FoodPrep]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The food preparation entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodPrep'
 *       404:
 *         description: Food preparation entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update a food preparation entry
 *     tags: [FoodPrep]
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
 *               consumer:
 *                 type: string
 *               chefChoice:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *               mode:
 *                 type: string
 *                 enum: [delivery, pickup]
 *               deliveryDate:
 *                 type: string
 *                 format: date-time
 *               address:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               meals:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/FoodPrepMealItem'
 *     responses:
 *       200:
 *         description: Updated food preparation entry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodPrep'
 *                 message:
 *                   type: string
 *                   example: Food preparation entry updated successfully
 *       404:
 *         description: Food preparation entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a food preparation entry
 *     tags: [FoodPrep]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Food preparation entry deleted
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
 *                   example: Food preparation entry deleted successfully
 *       404:
 *         description: Food preparation entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get food prep entry by ID
router.get('/:id', FoodPrepController.getById);

// Update food prep entry
router.put('/:id', FoodPrepController.update);

/**
 * @swagger
 * /api/food-prep/{id}/status:
 *   patch:
 *     summary: Update a food preparation entry's status
 *     tags: [FoodPrep]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FoodPrep'
 *                 message:
 *                   type: string
 *                   example: Food preparation status updated successfully
 *       400:
 *         description: Status is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Food preparation entry not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Update food prep status
router.patch('/:id/status', FoodPrepController.updateStatus);

/**
 * @swagger
 * /api/food-prep/consumer/{consumerId}:
 *   get:
 *     summary: Get food preparation entries by consumer ID
 *     tags: [FoodPrep]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of the consumer's food preparation entries
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
 *                     $ref: '#/components/schemas/FoodPrep'
 *                 meta:
 *                   $ref: '#/components/schemas/FoodPrepListMeta'
 */
// Get food prep entries by consumer
router.get('/consumer/:consumerId', FoodPrepController.getByConsumer);

// Delete food prep entry
router.delete('/:id', FoodPrepController.delete);

export default router;
