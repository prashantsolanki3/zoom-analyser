class Connection {
  constructor() {
    this.useAccessTokenVerificationAPI = false;
    this.socket = {
      "initSocket": false,
      "socketDefaultOptions": {},
      "accessTokenVerification": false
    };
    this.bypassBackend = process.env.NEXT_PUBLIC_BYPASS_BACKEND;
    this.useDeakinSSO = false;
    this.useACL = false;
  }
}

const instance = new Connection();
export default instance;