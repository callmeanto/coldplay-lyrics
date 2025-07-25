import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MemStorage } from '../../server/storage.js';

const storage = new MemStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const song = await storage.getSong(id as string);
      if (!song) {
        return res.status(404).json({ message: "Song not found" });
      }
      return res.json(song);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch song" });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}