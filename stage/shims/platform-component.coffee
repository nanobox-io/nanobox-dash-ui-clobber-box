AppComponent = require './app-component'

module.exports = class PlatformComponent

  constructor: (@id, @kind) ->
    @isSplitable     = Math.random() > 0.5
    @mode            = 'simple' # 'scalable'
    @adminPath     = "/some/path/to/admin"
    @components      = [
      new AppComponent('db', 'default-db', false).serialize()
      new AppComponent('db', 'default-db', false).serialize()
    ]

  serialize : () ->
    id            : @id
    kind          : @kind
    isSplitable   : @isSplitable
    mode          : @mode
    components    : @components
    adminPath     : @adminPath


{
  id: "logger1",
  kind: "mesh",
  mode: "simple",
  isSplitable: true,
  components: [
    {
      id: "9e63d700-c84e-45ed-ba15-ed192fcf92b2",
      uid: "data.portal",
      name: "lucky-lime",
      state: "created",
      serviceType: "default-db",
      scalesHoriz: false,
      scalesRedund: false,
      isSplitable: true,
      generations: [
        {
          id: "data.portal.gen1",
          state: "created",
          status: "online",
          instances: [
            {
              id: 1,
              hostId: "test-host-name",
              hostName: "test-host-name",
              state: "created",
              status: "online",
              role: "default",
              serverSpecsId: "512mb"
            }
          ]
        }
      ]
    }
  ]
}
