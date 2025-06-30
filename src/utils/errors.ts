// export class ScoreexlVoiceError extends Error {
//   constructor(
//     public readonly status: number,
//     public readonly code: string,
//     message: string
//   ) {
//     super(message);
//     this.name = "ScoreexlVoiceError";
//   }
// }

// export class ValidationError extends ScoreexlVoiceError {
//   constructor(details: any) {
//     super(422, "VALIDATION_ERROR", "Validation error occurred");
//     this.details = details;
//   }
//   details: any;
// }

// export class AuthenticationError extends ScoreexlVoiceError {
//   constructor(message: string = "Authentication failed") {
//     super(401, "AUTH_ERROR", message);
//   }
// }

export class ValidationError extends Error {
  constructor(public details: any) {
    super("Validation error");
  }
}

export class AuthenticationError extends Error {
  constructor() {
    super("Authentication failed");
  }
}

export class ScoreexlVoiceError extends Error {
  constructor(
    public status: number,
    public code: string,
    public message: string,
  ) {
    super(message);
  }
}
