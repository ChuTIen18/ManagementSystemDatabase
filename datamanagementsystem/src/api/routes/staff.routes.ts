import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Staff routes' });
});

export default router;
