module.exports = class WindowScroller

  constructor: () ->
    # Only initialize one per page
    return null if window.__wind_scroller?
    window.__wind_scroller = @

    PubSub.subscribe 'SCROLL_TO', (m,data) =>
      @scrollWindowTo data, 480, 600, 20

  scrollWindowTo : ($el, delay=0, duration=500, topPadding=0) ->
    top = $el.offset().top - topPadding


    # If the target scroll position cannot be scrolled to the top of the page
    # because the body height isn't tall enough to accomodate the needed space
    # below the target item
    if $('body').height() - top < top
      top = $('body').height() - top

    # I don't remember what we're checking for with top != topPadding...I'm tempted to remove it
    if top != topPadding
      $('html,body')
        .velocity('scroll',{ delay:delay, duration:duration, offset:top, easing:'easeInOutQuint'})

  scrollWindowtoFutureSize : ($el, delay=0, duration=500, topPadding, projectedHeight=0 ) ->
    top           = $el.offset().top - topPadding
    bodyHeight    = $('body').height() + projectedHeight
    windowHeight  = $(window).height()

    # console.log """
    # top    : #{top}
    # body   : #{$('body').height()}
    # window : #{$(window).height()}
    # """

    # If bodyheight is short enough that top can't be scrolled to the top of
    # the window, just scroll as far as the body can be scrolled
    if bodyHeight-top < windowHeight
      top = bodyHeight - windowHeight

    # Only scroll if the body is greater than the window
    if bodyHeight > windowHeight
      $('html,body')
        .delay(delay)
        .velocity({scrollTop: top},{ duration:duration, easing:"easeInOutQuint"})
