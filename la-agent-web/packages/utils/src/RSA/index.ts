import JSEncrypt from 'jsencrypt';

const publicKey =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv2CMEF2HpFV+apdY8VzXpmY2lWKEobqkhrrpAwk+qz34C/AchFr9xT14B+JdHTwwrKlRsNDdvsQC2cRs0cQiGOe9zlr78RYfWHubqlnkeSNsfKnIky6ZMhimQLd5ruAHQ4iw3i5TT/slk2KDa+ipaPmOmMqTKsi20cNy4ABewqQMt3OsNZo6LzxuvUXWy3ibaliFPEv0KPQRx7cFsU/Kr0HPbAo5ERQwpAKeHCSw6UiOwM7IfYb9ZslPDcEH/LPCotbMocOgpBIy3DLi3KpJBt3iFEObzz4rAbFGgKe3waCe+imXndX/5QeFyBi4RCf6LhHqLUye6C289t2stz5UIwIDAQAB';
/**
 * @description Encrypt the data using the public key
 * @param {string} data 加密字符串
 * @returns {string} 加密后的字符串
 */
export const encrypt = (data: string, pubKey?: string): string => {
  let encryptor = new JSEncrypt(); // 新建SEncrypt对家
  encryptor.setPublicKey(pubKey ? pubKey : publicKey);
  return encryptor.encrypt(data) || data;
};
