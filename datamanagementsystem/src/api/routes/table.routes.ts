import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Table routes' });
});

export default router;
