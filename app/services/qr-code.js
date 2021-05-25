import Service from "@ember/service";
import QRCode from "qrcode";

export default class QrCodeService extends Service {
  toCanvas() {
    return QRCode.toCanvas(...arguments);
  }
}
