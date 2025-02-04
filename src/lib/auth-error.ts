import { CredentialsSignin } from 'next-auth';

export class EmailNotVerifiedError extends CredentialsSignin {
  constructor(message = 'email-not-verified-error') {
    super();
    this.message = message;
  }
}

export class BadCredentialsError extends CredentialsSignin {
  constructor(message = 'bad-credentials-error') {
    super();
    this.message = message;
  }
}

export class UserNotActiveError extends CredentialsSignin {
  constructor(message = 'user-not-active-error') {
    super();
    this.message = message;
  }
}

export class UnauthorizedError extends CredentialsSignin {
  constructor(message = 'unauthorized-error') {
    super();
    this.message = message;
  }
}
