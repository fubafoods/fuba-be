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
 *           example: "64f2a1b3c4d5e6f7a8b9c0d3"
 *         choiceOfMeal:
 *           type: string
 *           description: FoodItem ObjectId (may be populated with name, category, description, price, image)
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         description:
 *           type: string
 *           example: Party jollof rice with grilled chicken and fried plantain
 *         note:
 *           type: string
 *           example: Extra spicy, no onions please
 *         quantity:
 *           type: integer
 *           example: 2
 *         measurement:
 *           type: string
 *           enum: [litre, service]
 *           example: service
 *         amount:
 *           type: number
 *           description: Amount to be charged for this meal item
 *           example: 4500
 *     FoodPrep:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d4"
 *         consumer:
 *           type: string
 *           description: User (consumer) ObjectId, may be populated with name and email
 *           example: "64f2a1b3c4d5e6f7a8b9c0d5"
 *         chefChoice:
 *           type: string
 *           description: Chef (User) ObjectId, may be populated with name and email
 *           example: "64f2a1b3c4d5e6f7a8b9c0d6"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *           default: pending
 *           example: confirmed
 *         mode:
 *           type: string
 *           enum: [delivery, pickup]
 *           example: delivery
 *         deliveryDate:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         address:
 *           type: string
 *           example: 12 Admiralty Way, Lekki Phase 1, Lagos
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         meals:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FoodPrepMealItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-05-30T09:15:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T08:00:00.000Z"
 *     FoodPrepListMeta:
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
 * /food-prep:
 *   post:
 *     summary: Create a food preparation entry
 *     description: >
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/food-prep`
 *     tags: [Food Prep]
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
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-prep`
 *     tags: [Food Prep]
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
 * /food-prep/status/{status}:
 *   get:
 *     summary: Get food preparation entries by status
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-prep/status/{status}`
 *     tags: [Food Prep]
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
 * /food-prep/mode/{mode}:
 *   get:
 *     summary: Get food preparation entries by delivery mode
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-prep/mode/{mode}`
 *     tags: [Food Prep]
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
 * /food-prep/{id}:
 *   get:
 *     summary: Get a food preparation entry by ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-prep/{id}`
 *     tags: [Food Prep]
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
 *     description: >
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/food-prep/{id}`
 *     tags: [Food Prep]
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
 *     description: >
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/food-prep/{id}`
 *     tags: [Food Prep]
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
 * /food-prep/{id}/status:
 *   patch:
 *     summary: Update a food preparation entry's status
 *     description: >
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/food-prep/{id}/status`
 *     tags: [Food Prep]
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
 * /food-prep/consumer/{consumerId}:
 *   get:
 *     summary: Get food preparation entries by consumer ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/food-prep/consumer/{consumerId}`
 *     tags: [Food Prep]
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
