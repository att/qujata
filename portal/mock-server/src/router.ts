import { Router } from 'express';
import { Request, Response, Router as CoreRouter } from 'express-serve-static-core';

const router: CoreRouter = Router();


router.post('/analyze', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  const data = { from: '1698747472962', to: '1698747480624' };
  // if( ['prime256v1', 'secp384r1'].includes(req.body.algorithm)){
  //   data = (await import('./classic-test.json')).default;
  // }
  // else if( ['p256_kyber512', 'p384_kyber768'].includes(req.body.algorithm)){
  //   data = (await import('./hybrid-test.json')).default;
  // }
  // else{
  //   data = (await import('./quantum-test.json')).default;

  // }

  setTimeout(() => {
    res.json(data)
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

router.get('/test', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  const data = (await import('./test.json')).default;
  setTimeout(() => {
    res.json(data);
  }, 1500);
});

export default router;
