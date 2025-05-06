import { Request, Response, NextFunction } from 'express';

function logger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInMs = (diff[0] * 1e9 + diff[1]) / 1e6;
    const { statusCode } = res;
    const timestamp = new Date().toISOString();

    console.log(
      `[${timestamp}] ${method} ${originalUrl} ${statusCode} ${durationInMs.toFixed(2)}ms - IP: ${ip}`
    );
  });

  next();
}

export default logger;
