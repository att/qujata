import { Router } from 'express';
import { Request, Response, Router as CoreRouter } from 'express-serve-static-core';

const router: CoreRouter = Router();


router.post('/test', async (req: Request, res: Response) => {
  console.log(`-${req.method} ${req.url}`);
  let data;
  if( ['prime256v1', 'secp384r1'].includes(req.body.algorithm)){
    data = (await import('./classic-test.json')).default;
  }
  else if( ['p256_kyber512', 'p384_kyber768'].includes(req.body.algorithm)){
    data = (await import('./hybrid-test.json')).default;
  }
  else{
    data = (await import('./quantum-test.json')).default;

  }

  setTimeout(() => {
    res.json(data)
  }, 1500);
});

export default router;
