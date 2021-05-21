import Pretender from "pretender";

export const setupPretender = function (hooks) {
  hooks.beforeEach(function () {
    this.pretender = new Pretender();
  });

  hooks.afterEach(function () {
    this.pretender.shutdown();
  });

  return hooks;
};
