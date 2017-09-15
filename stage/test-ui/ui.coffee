module.exports = class UI

  constructor: () ->
    @initStateSelector $(".states")
    # @initStateSelector $("#gen-states")
    @initEvents()

    PubSub.subscribe 'REGISTER', (m, box)=>
      @registerBox box

  registerBox : (box) ->
    if box.data.id.includes 'gen'
      @addToSelector $('.generations', '.ui-shim'), box
    else
      @addToSelector $('.hosts', '.ui-shim'), box

  addToSelector : ($selector, box) ->
    return if $("option[value='#{box.data.id}']", $selector).length != 0
    $selector.append "<option value='#{box.data.id}'>#{box.data.id}</option>"

  initStateSelector : ($selector) ->
    states = ['', 'created', 'initialized', 'ordered', 'provisioning', 'defunct', 'active', 'decomissioning', 'destroy', 'archived']
    for state in states
      $selector.append "<option value='#{state}'>#{state}</option>"

  initEvents : () ->
    $("button#hosts").on 'click', ()=>
      id = $("select#hosts-state-selector").val()
      state = $("select#host-states").val()
      setState id, state

    $("button#generations").on 'click', ()=>
      id = $("select#generations-state-selector").val()
      state = $("select#gen-states").val()
      setGenerationState id, state

    $("button#gen-status-go").on 'click', ()=>
      id = $("select#generations-status-selector").val()
      status = $("select#gen-status").val()
      setGenerationStatus id, status

    $("button#add-generation").on 'click', ()=>
      addGeneration $("select#add-generation-select").val()

    $("button#remove-generation").on 'click', ()=>
      removeGeneration $("select#remove-generation-select").val()

    $("button#add-component").on 'click', ()=>
      addComponent $("select#add-component-select").val()

    $("button#remove-component").on 'click', ()=>
      removeComponent $("select#remove-component-select").val()

  noteComponents : (box) ->
    $selector = $ "select.components"
    for component in box.data.appComponents
      $selector.append "<option value='#{component.id}'>#{component.id}</option>"
