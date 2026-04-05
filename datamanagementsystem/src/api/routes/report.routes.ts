import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Report routes' });
});

export default router;
