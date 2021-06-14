import { module, test } from "qunit";
import { setupTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";
import ENV from "ucentral/config/environment";

module("Unit | Service | http", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    this.subject = this.owner.lookup("service:http");
  });

  test("it exists", function (assert) {
    assert.ok(this.subject);
  });

  module("#createUrl", function () {
    test("it returns base url with provided sub url", function (assert) {
      assert.equal(
        this.subject.createUrl("/api/v1"),
        "http://localhost:4200/api/v1"
      );
    });

    test("it returns url with query params", function (assert) {
      assert.equal(
        this.subject.createUrl("/api/v1", { count: 0 }),
        "http://localhost:4200/api/v1?count=0"
      );
    });

    test("it filters out undefined values from query params", function (assert) {
      assert.equal(
        this.subject.createUrl("/api/v1", {
          count: 0,
          shouldNotExist: undefined,
        }),
        "http://localhost:4200/api/v1?count=0"
      );
    });

    test("it filters out null values from query params", function (assert) {
      assert.equal(
        this.subject.createUrl("/api/v1", {
          count: 0,
          shouldNotExist: null,
        }),
        "http://localhost:4200/api/v1?count=0"
      );
    });
  });

  module("GET", function () {
    test("sends request", async function (assert) {
      assert.expect(1);

      const done = assert.async();
      this.server.get(`${ENV.APP.BASE_API_URL}/sampleGet`, function () {
        assert.ok(true);
        done();
      });

      this.subject.get("/sampleGet");
    });

    test("sends request with queryParams", async function (assert) {
      assert.expect(1);

      const done = assert.async();
      this.server.get(
        `${ENV.APP.BASE_API_URL}/sampleGet`,
        function (schema, request) {
          assert.equal(request.queryParams.count, 0);
          done();
        }
      );

      this.subject.get("/sampleGet", { count: 0 });
    });

    test("sends request headers", async function (assert) {
      assert.expect(1);

      const done = assert.async();
      this.server.get(
        `${ENV.APP.BASE_API_URL}/sampleGet`,
        function (schema, request) {
          assert.equal(request.requestHeaders["X-UC-ID"], "some id");
          done();
        }
      );

      this.subject.get("/sampleGet", { count: 0 }, { "X-UC-ID": "some id" });
    });
  });
});
