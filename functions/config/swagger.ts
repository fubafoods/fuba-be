import swaggerJSDoc from 'swagger-jsdoc';

const port = process.env.PORT || 3000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fuba API',
      version: '1.0.0',
      description: `Fuba Food Delivery & Vendor Marketplace Backend API.

**Base URL**: \`/api\`
**Authentication**: Bearer JWT (\`Authorization: Bearer <token>\`)
**Roles**: \`consumer\`, \`vendor\`, \`luxury_restaurant\`, \`admin\`

API documentation for the Fuba backend (auth, users, vendors, restaurants, meals, orders, cart, promos and file uploads).`,
    },
    servers: [
      { url: 'https://fuba-be-hbjt.onrender.com/api', description: 'Production (Render)' },
      { url: `http://localhost:${port}/api`, description: 'Local server' },
    ],
    tags: [
      {
        name: 'Customer Auth',
        description: "Sign-up, login, and password-reset flows for customers — the primary app users who browse and order food. This is the same actor type as the \"consumer\" role/param used in the Cart, Order, and Food Prep endpoints; the API uses \"customer\" in auth routes and \"consumer\" elsewhere for historical reasons, not because they differ.",
      },
      {
        name: 'Vendor Auth',
        description: 'Sign-up, login, and password-reset flows for food vendors — independent/informal food businesses. Registration completes immediately and includes an optional NAFDAC seal certification workflow (request, pay, upload). Vendor and Restaurant are genuinely different business/actor types (see Restaurant Auth); note Vendor is currently missing the resend-verification-OTP endpoint that Customer and Restaurant both have.',
      },
      {
        name: 'Restaurant Auth',
        description: 'Sign-up, login, and password-reset flows for restaurants — a more formal business type whose registration is submitted as an application with a review status (pending_review / approved / rejected) rather than being activated immediately. No NAFDAC workflow, unlike Vendor Auth.',
      },
      {
        name: 'Users',
        description: 'Authenticated profile management — fetching/updating profile details, changing password, and uploading a profile picture. Applies to any authenticated actor regardless of role.',
      },
      {
        name: 'Restaurants',
        description: "CRUD and discovery for restaurant storefronts: creating/editing a restaurant's public listing and menu items, ratings, and location/promo-based search.",
      },
      {
        name: 'Promos',
        description: 'Promotional campaigns (discounts, free delivery) created by vendors/restaurants and surfaced on restaurant listings.',
      },
      {
        name: 'Orders',
        description: 'Standard food orders placed against a vendor\'s Food Items, with quantities, a computed total price, and a structured delivery address. See Food Prep for the separate scheduled bulk-prep request flow.',
      },
      {
        name: 'Meals',
        description: "A vendor-managed catalog of standalone meal listings (service tier, category, combo add-ons, stock status). Not currently referenced by the Order, Food Prep, or Restaurant models — this looks like a separate/newer vendor menu system running alongside Food Items rather than one wired into checkout.",
      },
      {
        name: 'Food Prep',
        description: "Scheduled, made-to-order bulk food-prep requests placed with a specific chosen chef, quantified by litre or service unit with a future delivery date (pending → confirmed → preparing → ready → delivered). Distinct from Orders, which are standard itemized vendor purchases with immediate delivery-address checkout.",
      },
      {
        name: 'Food Items',
        description: 'The canonical, orderable menu item entity (three-tier pricing: regular/premium/executive) referenced by Restaurant listings, Orders, and Food Prep requests — this is what customers actually order, as distinct from Meals above.',
      },
      {
        name: 'Files',
        description: 'Generic authenticated file upload/management (Cloudinary-backed) used by other features (profile pictures, restaurant images, NAFDAC documents, etc.) for direct upload, retrieval, transformation, and deletion of stored files.',
      },
      {
        name: 'Cart',
        description: "A consumer's in-progress order — adding/removing Food Items before checkout. Uses \"consumer\" terminology (consumerId) consistent with the Order and Food Prep schemas; see the Customer Auth tag description for the consumer/customer naming note.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Resource not found' },
            error_code: { type: 'string', example: 'NOT_FOUND' },
          },
        },
      },
    },
  },
  apis: [
    './features/**/*.route.ts',
    './lib/features/**/*.route.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
