export default function (server) {
  server.loadFixtures("devices");
  server.loadFixtures("connecteddevices");
  server.loadFixtures("healthchecks");
  /*
    Seed your development database using your factories.
    This data will not be loaded in your tests.
  */
  // server.createList('post', 10);
}
