import { env } from "$env";
import pino, { LoggerOptions } from "pino";
import pinoHTTP from "pino-http";

const options = (
    env.NODE_ENV === "development"
        ? {
              transport: {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                  },
              },
          }
        : {}
) satisfies LoggerOptions;
export const logger = pino(options);

export const logMiddleware = pinoHTTP({ logger });
