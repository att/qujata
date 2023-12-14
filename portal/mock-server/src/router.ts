import { Router } from 'express';
import { Request, Response, Router as CoreRouter } from 'express-serve-static-core';

const router: CoreRouter = Router();


router.post('/analyze', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  const data = {testSuiteId: 'testSuiteId-123'};
  setTimeout(() => {
    res.json(data);
  }, 1500);
});

router.get('/algorithms', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  const data = (await import('./algorithms.json')).default;
  setTimeout(() => {
    res.json(data);
  }, 1500);
});

router.get('/iterations', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  const data = (await import('./iterations.json')).default;
  setTimeout(() => {
    res.json(data);
  }, 1500);
});

router.get('/test/:testSuiteId', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  const data = (await import('./test.json')).default;
  setTimeout(() => {
    res.json(data);
  }, 1500);
});

export default router;
