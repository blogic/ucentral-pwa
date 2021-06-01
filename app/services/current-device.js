import Service from "@ember/service";

export default class CurrentDeviceService extends Service {
  isConfigured = false;
  name = "Dummy";
  serialNumber = "Dummy serial number";
}
