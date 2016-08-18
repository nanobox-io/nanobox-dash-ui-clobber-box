module.exports = class NameMachine

  @services :
    ruby      : 'Ruby'
    mysql     : 'MySQL'
    mongo     : 'Mongo'
    node      : 'Node JS'
    memcached : 'MemcacheD'
    python    : 'Python'
    storage   : 'Storage'
    java      : 'Java'
    php       : 'PHP'
    couch     : 'Couch DB'
    maria     : 'Maria DB'
    postgres  : 'Postgres DB'
    redis     : 'Redis'
    percona   : 'Percona DB'

    mist      : "Message Bus"
    logvac    : "Logger"
    pulse     : "Monitor"
    portal    : "Routing Mesh"
    hoarder   : "Warehouse"

    db        : 'Database'
    default   : 'Default'

  @getName : (id)->
    return { id: id, name:NameMachine[id] }

  @findName : (haystack) ->
    console.log haystack
    for key, val of NameMachine.services
      if new RegExp(key,"g").test haystack
        return { id: key, name:val }
    return {id: 'default', name: NameMachine.services.default }
