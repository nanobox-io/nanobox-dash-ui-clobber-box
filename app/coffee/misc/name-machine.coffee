module.exports = class NameMachine

  # Frameworks
  @entities :
    middleman :
      name: 'Middleman'
      exp : /middleman/

    # Languages
    ruby      :
      name: 'Ruby'
      exp : /ruby/
    node      :
      name: 'Node JS'
      exp : /node/
    python    :
      name: 'Python'
      exp : /python/
    java      :
      name: 'Java'
      exp : /java/
    php       :
      name: 'PHP'
      exp : /php/
    erlang :
      name : 'Erlang'
      exp : /erlang/
    elixir :
      name : 'Elixir'
      exp : /elixir/
    scala :
      name : 'Scala'
      exp : /scala/
    rust :
      name : 'Rust'
      exp : /rust/
    java :
      name : 'Java'
      exp : /java/
    golang :
      name : 'Go'
      exp : /golang/

    # Data Services
    mysql     :
      name: 'MySQL'
      exp : /mysql/
    mongo     :
      name: 'Mongo'
      exp : /mongo/
    couch     :
      name: 'Couch DB'
      exp : /couch/
    maria     :
      name: 'Maria DB'
      exp : /maria/
    postgres  :
      name: 'Postgres'
      exp : /postgres/
    redis     :
      name: 'Redis'
      exp : /redis/
    percona   :
      name: 'Percona DB'
      exp : /percona/
    memcached   :
      name: 'Memcached'
      exp : /memcached/
    rethink   :
      name: 'Rethink'
      exp : /rethink/

    # Platform Services
    mist      :
      name: 'Message Bus'
      exp : /mist/
    logvac    :
      name: 'Logger'
      exp : /logvac/
    pulse     :
      name: 'Monitor'
      exp : /pulse/
    portal    :
      name: 'Routing Mesh'
      exp : /portal/
    hoarder   :
      name: 'Warehouse'
      exp : /hoarder/

    # MISC
    storage   :
      name: 'Storage'
      exp : /storage/
    db        :
      name: 'Database'
      exp : /db/
    tolmar:
      name: 'Gulp Static Site'
      exp : /tolmar/
    default   :
      name: 'Default'
      exp : /default/
    memcached :
      name: 'MemcacheD'
      exp : /memcached/


  @getName : (id)->
    return { id: id, name:NameMachine.entities[id].name }

  @findName : (haystack) ->
    for key, val of NameMachine.entities
      if val.exp.test haystack
        return { id: key, name:val.name }
    return {id: 'default', name: 'Component' }
