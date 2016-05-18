module.exports = class LineAnimator

  constructor: (@$el, componentKind, animationKind, message) ->
    @setCrossPlatform()
    svgId = @getSvgId componentKind
    $svg = $ "<img class='shadow-icon' data-src='#{svgId}' />"
    @$el.append $svg
    castShadows @$el
    @path = $( 'path', @$el )[0]
    @path.style['stroke-dashoffset'] = 3000
    @startAnimation animationKind

  buildTick : () =>
    if @dashArray[1] > 80
      for item, i in @dashArray by 2
        if @dashArray[i+1] > 80
          inc = Math.random()/2
          @dashArray[i]   += inc
          @dashArray[i+1] -= inc

    @path.style['stroke-dasharray'] = @dashArray
    @path.style['stroke-dashoffset'] = @offset += @speed
    @tickId = requestAnimationFrame @buildTick

  destroyTick : () =>
    if @dashArray[0] > 11
      for item, i in @dashArray by 2
        if @dashArray[i+1] > 80
          inc = Math.random()/3
          @dashArray[i]   -= inc
          @dashArray[i+1] += inc

    @path.style['stroke-dasharray'] = @dashArray
    @path.style['stroke-dashoffset'] = @offset += @speed
    @tickId = requestAnimationFrame @destroyTick

  # TODO: Do more to destory this I think...
  destroy : ()->
    cancelAnimationFrame @tickId
    @path = null
    @$el.empty()


  startAnimation : (animationKind) ->
    if animationKind == 'build'
      @dashArray = [2, 800, 2, 600, 2, 400]
      @path.style['stroke-dasharray'] = @dashArray
      @speed  = 8
      @offset = 0
      @buildTick()
    else if animationKind == 'destroy'
      @dashArray = [160, 100]
      @path.style['stroke-dasharray'] = @dashArray
      @path.style['stroke'] = '#D2D2D2'
      @speed  = 6
      @offset = 0
      @destroyTick()

  getSvgId : (componentKind) ->
    switch componentKind
      when 'host', 'cluster' then 'host-silvering'
      when 'component'       then 'component-silvering'


  setCrossPlatform : ()->
    return if window.crossPlatformAlreadySet
    window.crossPlatformAlreadySet = true
    for vendor in ['ms', 'moz', 'webkit', 'o']
      window.requestAnimationFrame = window.requestAnimationFrame || window["#{vendor}RequestAnimationFrame"]
      window.cancelAnimationFrame  = window.cancelAnimationFrame  || window["#{vendor}CancelAnimationFrame"] || window["#{vendor}CancelRequestAnimationFrame"];
      break if window.requestAnimationFrame?
