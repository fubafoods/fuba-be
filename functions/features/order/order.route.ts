import { Router } from 'express';
import OrderController from './order.controller';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         foodItem:
 *           type: string
 *           description: FoodItem ObjectId
 *         quantity:
 *           type: integer
 *           minimum: 1
 *     OrderDeliveryAddress:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         zipCode:
 *           type: string
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         consumer:
 *           type: string
 *           description: Consumer (User) ObjectId; populated with name and email in responses
 *         vendor:
 *           type: string
 *           description: Vendor (User) ObjectId; populated with name and email in responses
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, accepted, preparing, ready, delivered, cancelled]
 *           default: pending
 *         mode:
 *           type: string
 *           enum: [delivery, pickup]
 *         deliveryAddress:
 *           $ref: '#/components/schemas/OrderDeliveryAddress'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     OrderListMeta:
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
 * /api/order:
 *   post:
 *     summary: Create an order
 *     description: Creates a new order for a consumer with a vendor, ordered items, delivery/pickup mode and (for delivery) an address.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [consumer, vendor, items, totalPrice, mode, deliveryAddress]
 *             properties:
 *               consumer:
 *                 type: string
 *                 description: Consumer (User) ObjectId
 *               vendor:
 *                 type: string
 *                 description: Vendor (User) ObjectId
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               totalPrice:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, preparing, ready, delivered, cancelled]
 *                 default: pending
 *               mode:
 *                 type: string
 *                 enum: [delivery, pickup]
 *               deliveryAddress:
 *                 $ref: '#/components/schemas/OrderDeliveryAddress'
 *     responses:
 *       201:
 *         description: Order created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *       500:
 *         description: Validation or server error (e.g. missing required fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   get:
 *     summary: List orders
 *     description: >
 *       Retrieves orders with pagination. Any query parameter is forwarded directly as a MongoDB
 *       filter, so supported filter fields include status, mode, consumer and vendor. Pagination
 *       is currently fixed at page 1 with a limit of 10 regardless of query parameters.
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, accepted, preparing, ready, delivered, cancelled]
 *         description: Filter orders by status
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [delivery, pickup]
 *         description: Filter orders by delivery mode
 *       - in: query
 *         name: consumer
 *         schema:
 *           type: string
 *         description: Filter orders by consumer (User) ObjectId
 *       - in: query
 *         name: vendor
 *         schema:
 *           type: string
 *         description: Filter orders by vendor (User) ObjectId
 *     responses:
 *       200:
 *         description: List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   $ref: '#/components/schemas/OrderListMeta'
 */
// Create an order
router.post('/', OrderController.create);

// Get all orders (with optional query)
router.get('/', OrderController.get);

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get order by ID
router.get('/:id', OrderController.getById);

/**
 * @swagger
 * /api/order/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Updates the status of an existing order (e.g. as it moves through preparation and delivery).
 *     tags: [Orders]
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
 *                 enum: [pending, accepted, preparing, ready, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *                 message:
 *                   type: string
 *                   example: Order status updated to accepted
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Update order status
router.patch('/:id/status', OrderController.updateStatus);

/**
 * @swagger
 * /api/order/consumer/{consumerId}:
 *   get:
 *     summary: Get orders placed by a consumer
 *     description: Retrieves paginated orders for a specific consumer. Returns an empty list if consumerId is not a valid ObjectId.
 *     tags: [Orders]
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
 *         description: The consumer's orders
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
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   $ref: '#/components/schemas/OrderListMeta'
 */
// Get orders by consumer
router.get('/consumer/:consumerId', OrderController.getByConsumer);

/**
 * @swagger
 * /api/order/vendor/{vendorId}:
 *   get:
 *     summary: Get orders received by a vendor
 *     description: Retrieves paginated orders for a specific vendor. Returns an empty list if vendorId is not a valid ObjectId.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: vendorId
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
 *         description: The vendor's orders
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
 *                     $ref: '#/components/schemas/Order'
 *                 meta:
 *                   $ref: '#/components/schemas/OrderListMeta'
 */
// Get orders by vendor
router.get('/vendor/:vendorId', OrderController.getByVendor);

export default router;
