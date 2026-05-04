import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { menuController } from '../controllers/menuController.js';
import { authMiddleware, rbacMiddleware } from '../middlewares/auth.js';

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('INVALID_FILE_TYPE'));
            return;
        }
        cb(null, true);
    },
});

const handleMenuUpload = (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, (error: any) => {
        if (!error) {
            return next();
        }

        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: {
                    code: 'FILE_TOO_LARGE',
                    message: 'Image size must not exceed 2MB',
                },
            });
        }

        if (error.message === 'INVALID_FILE_TYPE') {
            return res.status(400).json({
                error: {
                    code: 'INVALID_FILE_TYPE',
                    message: 'Only image files are allowed',
                },
            });
        }

        return res.status(400).json({
            error: {
                code: 'UPLOAD_ERROR',
                message: error.message || 'Image upload validation failed',
            },
        });
    });
};

// GET /api/v1/menu - Public (no auth required)
router.get('/', menuController.getAllMenuItems);

// GET /api/v1/menu/:id - Public
router.get('/:id', menuController.getMenuItemById);

// POST /api/v1/menu/upload-image - Manager and POS only
router.post(
    '/upload-image',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    handleMenuUpload,
    menuController.uploadMenuImage
);

// POST /api/v1/menu - Manager and POS only
router.post(
    '/',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    handleMenuUpload,
    menuController.createMenuItem
);

// PUT /api/v1/menu/:id - Manager and POS only
router.put(
    '/:id',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    handleMenuUpload,
    menuController.updateMenuItem
);

// PUT /api/v1/menu/:id/availability - Manager and POS only
router.put(
    '/:id/availability',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    menuController.toggleAvailability
);

// DELETE /api/v1/menu/:id - Manager and POS only
router.delete(
    '/:id',
    authMiddleware,
    rbacMiddleware(['manager', 'pos']),
    menuController.deleteMenuItem
);

export default router;