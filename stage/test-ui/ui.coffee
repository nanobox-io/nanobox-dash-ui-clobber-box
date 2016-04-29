module.exports = class UI

  constructor: () ->
    @initStateSelector $("#host-states")
    @initStateSelector $("#gen-states")
    @initEvents()

    PubSub.subscribe 'REGISTER', (m, box)=>
      @registerBox box

  registerBox : (box) ->
    if box.data.id.includes 'gen'
      @addToSelector $('#generation'), box
    else
      @addToSelector $('#hosts'), box

  addToSelector : ($selector, box) ->
    return if $("option[value='#{box.data.id}']", $selector).length != 0
    $selector.append "<option value='#{box.data.id}'>#{box.data.id}</option>"

  initStateSelector : ($selector) ->
    states = ['', 'created', 'initialized', 'ordered', 'provisioning', 'defunct', 'active', 'decomissioning', 'destroy', 'archived']
    for state in states
      $selector.append "<option value='#{state}'>#{state}</option>"

  initEvents : () ->
    $("button#hosts").on 'click', ()=>
      id = $("select#hosts").val()
      state = $("select#host-states").val()
      setState id, state

    $("button#generations").on 'click', ()=>
      id = $("select#generation").val()
      state = $("select#gen-states").val()
      setGenerationState id, state

    $("button#add-generation").on 'click', ()=>
      id = $("select#components").val()
      addGeneration id

  noteComponents : (box) ->
    $selector = $ "select#components"
    for component in box.data.appComponents
      $selector.append "<option value='#{component.id}'>#{component.id}</option>"
