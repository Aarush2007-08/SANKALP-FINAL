import { Router } from 'express';
import { generateListing } from '../ai.js';
import type { GenerateListingInput } from '../types.js';

const router = Router();

router.post('/generate-listing', (req, res) => {
  const { description } = req.body as GenerateListingInput;
  if (!description?.trim()) {
    res.status(400).json({ error: 'Description is required' });
    return;
  }

  setTimeout(() => {
    res.json(generateListing(description.trim()));
  }, 800);
});

export default router;
