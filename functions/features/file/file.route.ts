import { Router } from "express";
import FileController from "./file.controller";
import { upload, uploadImage } from "../../middleware/upload";
import jwtAuth from "../../middleware/jwtAuth";

const router = Router();

// Apply JWT authentication to all routes
router.use(jwtAuth);

/**
 * @swagger
 * components:
 *   schemas:
 *     FileRecord:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         filename:
 *           type: string
 *           description: Cloudinary public ID used as the stored filename
 *         originalName:
 *           type: string
 *         url:
 *           type: string
 *           description: Cloudinary secure URL
 *         publicId:
 *           type: string
 *         mimetype:
 *           type: string
 *         size:
 *           type: integer
 *           description: File size in bytes
 *         resourceType:
 *           type: string
 *           enum: [image, raw, video, auto]
 *         folder:
 *           type: string
 *         uploadedBy:
 *           type: string
 *           description: User ObjectId of the uploader
 *         associatedModel:
 *           type: string
 *           description: Name of the associated Mongoose model, e.g. Restaurant, FoodItem, User
 *         associatedId:
 *           type: string
 *           description: ObjectId of the associated document
 *         metadata:
 *           type: object
 *           additionalProperties: true
 *         isPublic:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     FileUploadResult:
 *       type: object
 *       description: Slim shape returned by the upload endpoints
 *       properties:
 *         id:
 *           type: string
 *         url:
 *           type: string
 *         publicId:
 *           type: string
 *         filename:
 *           type: string
 *         mimetype:
 *           type: string
 *         size:
 *           type: integer
 *     FileListMeta:
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
 * /api/file/upload:
 *   post:
 *     summary: Upload a single file
 *     description: >
 *       Uploads a single file (image or document) to Cloudinary and stores its metadata.
 *       Accepts images (jpeg, png, gif, webp, svg) and documents (pdf, doc, docx, xls, xlsx).
 *       Maximum file size 10MB.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Optional Cloudinary folder override
 *               associatedModel:
 *                 type: string
 *                 description: e.g. Restaurant, FoodItem, User
 *               associatedId:
 *                 type: string
 *                 description: ObjectId of the associated document
 *     responses:
 *       201:
 *         description: File uploaded successfully
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
 *                   example: File uploaded successfully
 *                 data:
 *                   $ref: '#/components/schemas/FileUploadResult'
 *       400:
 *         description: No file uploaded, or the file type/size is not allowed
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
// Upload single file (accepts both images and documents)
router.post("/upload", upload.single("file"), FileController.uploadSingle);

/**
 * @swagger
 * /api/file/upload-multiple:
 *   post:
 *     summary: Upload multiple files (max 10)
 *     description: >
 *       Uploads up to 10 files (images or documents) to Cloudinary and stores their metadata.
 *       Accepts images (jpeg, png, gif, webp, svg) and documents (pdf, doc, docx, xls, xlsx).
 *       Maximum file size 10MB each.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 description: Optional Cloudinary folder override
 *               associatedModel:
 *                 type: string
 *                 description: e.g. Restaurant, FoodItem, User
 *               associatedId:
 *                 type: string
 *                 description: ObjectId of the associated document
 *     responses:
 *       201:
 *         description: Files uploaded successfully
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
 *                   example: 3 file(s) uploaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FileUploadResult'
 *       400:
 *         description: No files uploaded, or a file type/size is not allowed
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
// Upload multiple files (max 10)
router.post("/upload-multiple", upload.array("files", 10), FileController.uploadMultiple);

/**
 * @swagger
 * /api/file/upload-image:
 *   post:
 *     summary: Upload a single image
 *     description: Uploads a single image (jpeg, png, gif, webp, svg) to Cloudinary. Maximum file size 5MB.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
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
 *               folder:
 *                 type: string
 *                 description: Optional Cloudinary folder override
 *               associatedModel:
 *                 type: string
 *                 description: e.g. Restaurant, FoodItem, User
 *               associatedId:
 *                 type: string
 *                 description: ObjectId of the associated document
 *     responses:
 *       201:
 *         description: Image uploaded successfully
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
 *                   example: File uploaded successfully
 *                 data:
 *                   $ref: '#/components/schemas/FileUploadResult'
 *       400:
 *         description: No image uploaded, or the file is not an allowed image type/size
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
// Upload single image only
router.post("/upload-image", uploadImage.single("image"), FileController.uploadSingle);

/**
 * @swagger
 * /api/file/upload-images:
 *   post:
 *     summary: Upload multiple images (max 10)
 *     description: Uploads up to 10 images (jpeg, png, gif, webp, svg) to Cloudinary. Maximum file size 5MB each.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [images]
 *             properties:
 *               images:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 description: Optional Cloudinary folder override
 *               associatedModel:
 *                 type: string
 *                 description: e.g. Restaurant, FoodItem, User
 *               associatedId:
 *                 type: string
 *                 description: ObjectId of the associated document
 *     responses:
 *       201:
 *         description: Images uploaded successfully
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
 *                   example: 3 file(s) uploaded successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FileUploadResult'
 *       400:
 *         description: No images uploaded, or a file is not an allowed image type/size
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
// Upload multiple images only (max 10)
router.post("/upload-images", uploadImage.array("images", 10), FileController.uploadMultiple);

/**
 * @swagger
 * /api/file/my-files:
 *   get:
 *     summary: Get the authenticated user's uploaded files
 *     tags: [Files]
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
 *         description: The user's files
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
 *                     $ref: '#/components/schemas/FileRecord'
 *                 meta:
 *                   $ref: '#/components/schemas/FileListMeta'
 *       401:
 *         description: Unauthorized / user not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get my uploaded files
router.get("/my-files", FileController.getMyFiles);

/**
 * @swagger
 * /api/file:
 *   get:
 *     summary: List files
 *     description: Retrieves all files with pagination.
 *     tags: [Files]
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
 *         description: List of files
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
 *                     $ref: '#/components/schemas/FileRecord'
 *                 meta:
 *                   $ref: '#/components/schemas/FileListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get all files (with pagination)
router.get("/", FileController.get);

/**
 * @swagger
 * /api/file/user/{userId}:
 *   get:
 *     summary: Get files uploaded by a specific user
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *         description: The user's files (empty list if userId is not a valid ObjectId)
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
 *                     $ref: '#/components/schemas/FileRecord'
 *                 meta:
 *                   $ref: '#/components/schemas/FileListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get files by user
router.get("/user/:userId", FileController.getByUser);

/**
 * @swagger
 * /api/file/associated/{model}/{documentId}:
 *   get:
 *     summary: Get files associated with a specific model and document
 *     description: e.g. files for a specific restaurant, food item or user.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: model
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the associated Mongoose model, e.g. Restaurant, FoodItem, User
 *       - in: path
 *         name: documentId
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
 *         description: The associated files (empty list if documentId is not a valid ObjectId)
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
 *                     $ref: '#/components/schemas/FileRecord'
 *                 meta:
 *                   $ref: '#/components/schemas/FileListMeta'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get files by association (e.g., files for a specific restaurant)
router.get("/associated/:model/:documentId", FileController.getByAssociation);

/**
 * @swagger
 * /api/file/{id}/transform:
 *   get:
 *     summary: Get a transformed image URL
 *     description: Builds a Cloudinary transformation URL for an existing image file. Only available for files whose resourceType is "image".
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: width
 *         schema:
 *           type: integer
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *       - in: query
 *         name: crop
 *         schema:
 *           type: string
 *           default: fill
 *       - in: query
 *         name: quality
 *         schema:
 *           type: string
 *           default: auto
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           default: auto
 *     responses:
 *       200:
 *         description: Original and transformed URLs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     originalUrl:
 *                       type: string
 *                     transformedUrl:
 *                       type: string
 *       400:
 *         description: File is not an image
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
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get transformed image URL
router.get("/:id/transform", FileController.getTransformedUrl);

/**
 * @swagger
 * /api/file/{id}/signed-url:
 *   get:
 *     summary: Get a signed URL for a private file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: expiresIn
 *         schema:
 *           type: integer
 *           default: 3600
 *         description: Expiry time in seconds
 *     responses:
 *       200:
 *         description: Signed URL generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     signedUrl:
 *                       type: string
 *                     expiresIn:
 *                       type: integer
 *                       example: 3600
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get signed URL for private files
router.get("/:id/signed-url", FileController.getSignedUrl);

/**
 * @swagger
 * /api/file/{id}:
 *   get:
 *     summary: Get a file by ID
 *     tags: [Files]
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
 *         description: The file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FileRecord'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a file by ID
 *     description: Deletes the file from Cloudinary (best-effort) and removes its metadata from the database.
 *     tags: [Files]
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
 *         description: File deleted
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
 *                   example: File deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: File not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Get file by ID
router.get("/:id", FileController.getById);

/**
 * @swagger
 * /api/file/bulk:
 *   delete:
 *     summary: Delete multiple files
 *     description: Deletes multiple files by ID from Cloudinary (best-effort) and the database.
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ids]
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Files deleted
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
 *                   example: 2 file(s) deleted successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     deleted:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *       400:
 *         description: No file IDs provided
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
// Delete multiple files
router.delete("/bulk", FileController.deleteMultiple);

// Delete file by ID (documented together with GET /api/file/{id} above)
router.delete("/:id", FileController.delete);

export default router;
