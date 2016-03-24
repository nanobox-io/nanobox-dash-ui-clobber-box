module.exports = class ClobberBoxDataShim

  constructor : () ->
    @boxCount = 0

  getBoxData : () ->
    @boxCount++
    {
      name: "EC2.#{@boxCount}"
      components: [
        {kind:'mongo-db'}
        {kind:'ruby'}
      ]
    }

  getClusterData : (clusterCount=6) ->
    {
      name: "EC2.#{++@boxCount} - EC2.#{@boxCount+=clusterCount}"
      serviceName: "web"
      componentKind: "ruby"
      totalMembers: clusterCount
    }
    # @boxCount += clusterCount
