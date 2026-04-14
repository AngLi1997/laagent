import Clipboard from '@react-native-clipboard/clipboard';


/**
 * 复制文本
 * @param text
 */
export const copyText = (text: string) => {
  try {
    Clipboard.setString(text)
  } catch (e) {
    console.log(e)
  }
};
