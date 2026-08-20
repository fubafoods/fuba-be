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
 *           example: "64f2a1b3c4d5e6f7a8b9c0e1"
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           example: 2
 *     OrderDeliveryAddress:
 *       type: object
 *       properties:
 *         street:
 *           type: string
 *           example: 12 Aba Road
 *         city:
 *           type: string
 *           example: Port Harcourt
 *         state:
 *           type: string
 *           example: Rivers
 *         zipCode:
 *           type: string
 *           example: "500001"
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "64f2a1b3c4d5e6f7a8b9c0d1"
 *         consumer:
 *           type: string
 *           description: >
 *             Reference to the ordering user (User ObjectId). Called "customer" in the Auth
 *             endpoints - same actor type, different naming in this part of the API; populated
 *             with name and email in responses
 *           example: "64f2a1b3c4d5e6f7a8b9c0d2"
 *         vendor:
 *           type: string
 *           description: Vendor (User) ObjectId; populated with name and email in responses
 *           example: "64f2a1b3c4d5e6f7a8b9c0d3"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *           example: 8500
 *         status:
 *           type: string
 *           enum: [pending, accepted, preparing, ready, delivered, cancelled]
 *           default: pending
 *           example: pending
 *         mode:
 *           type: string
 *           enum: [delivery, pickup]
 *           example: delivery
 *         deliveryAddress:
 *           $ref: '#/components/schemas/OrderDeliveryAddress'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2026-06-01T10:15:00.000Z"
 *     OrderListMeta:
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
 * /order:
 *   post:
 *     summary: Create an order
 *     description: >
 *       Creates a new order for a consumer with a vendor, ordered items, delivery/pickup mode and (for delivery) an address.
 *
 *       **Full URL:** `POST https://fuba-be-hbjt.onrender.com/api/order`
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
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/order`
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
 * /order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     description: >
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/order/{id}`
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
 * /order/{id}/status:
 *   patch:
 *     summary: Update order status
 *     description: >
 *       Updates the status of an existing order (e.g. as it moves through preparation and delivery).
 *
 *       **Full URL:** `PATCH https://fuba-be-hbjt.onrender.com/api/order/{id}/status`
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
 * /order/consumer/{consumerId}:
 *   get:
 *     summary: Get orders placed by a consumer
 *     description: >
 *       Retrieves paginated orders for a specific consumer. Returns an empty list if consumerId is not a valid ObjectId.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/order/consumer/{consumerId}`
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
 * /order/vendor/{vendorId}:
 *   get:
 *     summary: Get orders received by a vendor
 *     description: >
 *       Retrieves paginated orders for a specific vendor. Returns an empty list if vendorId is not a valid ObjectId.
 *
 *       **Full URL:** `GET https://fuba-be-hbjt.onrender.com/api/order/vendor/{vendorId}`
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
