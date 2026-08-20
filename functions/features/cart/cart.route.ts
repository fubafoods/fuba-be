import { Router } from 'express';
import CartController from './cart.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         foodItem:
 *           type: string
 *           description: FoodItem ObjectId
 *         quantity:
 *           type: integer
 *           minimum: 1
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         consumer:
 *           type: string
 *           description: User (consumer) ObjectId
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/cart/{consumerId}:
 *   get:
 *     summary: Get a consumer's cart
 *     description: Returns the cart for the given consumer. If no cart exists yet, returns an empty items list rather than a 404.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer (User) ObjectId
 *     responses:
 *       200:
 *         description: The consumer's cart (or an empty cart if none exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: Cart is empty
 */
router.get('/:consumerId', CartController.getCart);

/**
 * @swagger
 * /api/cart/{consumerId}/items:
 *   post:
 *     summary: Add an item to the cart
 *     description: Adds a food item (or increments its quantity) in the consumer's cart, creating the cart if it doesn't exist yet.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer (User) ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [foodItemId, quantity]
 *             properties:
 *               foodItemId:
 *                 type: string
 *                 description: FoodItem ObjectId
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: Item added to cart
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/:consumerId/items', CartController.addItem);

/**
 * @swagger
 * /api/cart/{consumerId}/items/{foodItemId}:
 *   put:
 *     summary: Update an item's quantity in the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer (User) ObjectId
 *       - in: path
 *         name: foodItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: FoodItem ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: Cart item updated
 *       404:
 *         description: Item not found in cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Item not found in cart
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer (User) ObjectId
 *       - in: path
 *         name: foodItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: FoodItem ObjectId
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: Item removed from cart
 */
router.put('/:consumerId/items/:foodItemId', CartController.updateItem);
router.delete('/:consumerId/items/:foodItemId', CartController.removeItem);

/**
 * @swagger
 * /api/cart/{consumerId}/clear:
 *   delete:
 *     summary: Clear the cart
 *     description: Removes all items from the consumer's cart.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: consumerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Consumer (User) ObjectId
 *     responses:
 *       200:
 *         description: Cart cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Cart'
 *                 message:
 *                   type: string
 *                   example: Cart cleared
 */
router.delete('/:consumerId/clear', CartController.clearCart);

export default router;