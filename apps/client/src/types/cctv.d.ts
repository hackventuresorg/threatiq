interface ICctv {
  name: string;
  rtspPath: string;
  publicIp: string;
  port: string;
  username: string;
  password: string;
  location: string;
  camCode: string;
  isActive: boolean;
  organization?: string;
}
