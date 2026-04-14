type ssoMessenger = {
  getUserToken: () => string;
  requestHeaderName: string;
};

export interface userTokenType {
  ssoMessenger: ssoMessenger;
}

type messenger = {
  lockMessage: Function;
};

export interface MessageInstance {
  messenger: messenger;
}
