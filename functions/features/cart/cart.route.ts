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
 *           example: "64f2a1b3c4d5e6f7a8b9c0d3"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d4"
 *         consumer:
 *           type: string
 *           description: User (consumer) ObjectId
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-05T14:30:00.000Z"
 */

/**
 * @swagger
 * /cart/{consumerId}:
 *   get:
 *     summary: Get a consumer's cart
 *     description: >
 *       Returns the cart for the given consumer. If no cart exists yet, returns an empty items list rather than a 404.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/cart/{consumerId}`
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
 * /cart/{consumerId}/items:
 *   post:
 *     summary: Add an item to the cart
 *     description: >
 *       Adds a food item (or increments its quantity) in the consumer's cart, creating the cart if it doesn't exist yet.
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/cart/{consumerId}/items`
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
 * /cart/{consumerId}/items/{foodItemId}:
 *   put:
 *     summary: Update an item's quantity in the cart
 *     description: >
 *       **Full URL:** `PUT https://fuba-be-hbjt.onrender.com/api/cart/{consumerId}/items/{foodItemId}`
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
 *     description: >
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/cart/{consumerId}/items/{foodItemId}`
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
 * /cart/{consumerId}/clear:
 *   delete:
 *     summary: Clear the cart
 *     description: >
 *       Removes all items from the consumer's cart.
 *
 *       **Full URL:** `DELETE https://fuba-be-hbjt.onrender.com/api/cart/{consumerId}/clear`
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