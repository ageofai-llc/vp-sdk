export class ScoreexlVoiceError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any,
  ) {
    super(message);
    this.name = "ScoreexlVoiceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScoreexlVoiceError);
    }
  }
}

export class AuthenticationError extends ScoreexlVoiceError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any,
  ) {
    super(message, statusCode, code, details);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ScoreexlVoiceError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any,
  ) {
    super(message, statusCode, code, details);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends ScoreexlVoiceError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any,
  ) {
    super(message, statusCode, code, details);
    this.name = "ValidationError";
  }
}

export class RateLimitError extends ScoreexlVoiceError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any,
  ) {
    super(message, statusCode, code, details);
    this.name = "RateLimitError";
  }
}

export class ServerError extends ScoreexlVoiceError {
  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: any,
  ) {
    super(message, statusCode, code, details);
    this.name = "ServerError";
  }
}

export class NetworkError extends ScoreexlVoiceError {
  constructor(message: string, originalError?: any) {
    super(message);
    this.name = "NetworkError";
    // this.details = { originalError };
  }
}
