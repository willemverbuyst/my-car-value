// https://yflooi.medium.com/nestjs-request-and-response-logging-with-middleware-b486121e4907
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `${req.method} ${req.originalUrl}`,
      Object.keys(req.body).length ? { body: req.body } : '',
    );

    getResponseLog(res);

    if (next) {
      next();
    }
  }
}

function getResponseLog(res: Response) {
  const rawResponse = res.write;
  const rawResponseEnd = res.end;

  let chunkBuffers = [];

  res.write = (...chunks) => {
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);

      if (!chunks[i]) {
        res.once('drain', res.write);
        --i;
      }
    }

    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    return rawResponse.apply(res, resArgs);
  };

  res.end = (...chunks) => {
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
    }

    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    const body = Buffer.concat(chunkBuffers).toString('utf8');

    res.setHeader('origin', 'restjs-req-res-logging-repo');

    const responseLog = `${res.statusCode} ${body}`;

    console.log(responseLog);

    rawResponseEnd.apply(res, resArgs);
    return responseLog as unknown as Response;
  };
}
