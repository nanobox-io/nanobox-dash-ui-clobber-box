module.exports = class WindowScroller

  constructor: () ->
    # Only initialize one per page
    return null if window.__wind_scroller?
    window.__wind_scroller = @

    PubSub.subscribe 'SCROLL_TO', (m,data) =>
      @scrollWindowTo data, 480, 600, 20

  scrollWindowTo : ($el, delay=0, duration=500, topPadding=0) ->
    topOfElement = $el.offset().top - topPadding

    # If the user scrolls durring the animation, cancel the animation
    $(window).on 'mousewheel', ()->
      $('html,body').stop true, false
      $(window).off 'mousewheel'

    # If the target scroll position cannot be scrolled to the top of the page
    # because the body height isn't tall enough to accomodate the needed space
    # below the target item, scroll to the bottom of the page
    # if $('body').height() - topOfElement < topOfElement
      # topOfElement = topOfElement

    $('html,body')
      .velocity 'scroll',{ delay:delay, duration:duration, offset:topOfElement, easing:'easeInOutQuint', complete:()->
        $(window).off 'mousewheel'
      }

  scrollWindowtoFutureSize : ($el, delay=0, duration=500, topPadding, projectedHeight=0 ) ->
    top           = $el.offset().top - topPadding
    bodyHeight    = $('body').height() + projectedHeight
    windowHeight  = $(window).height()


    # If bodyheight is short enough that top can't be scrolled to the top of
    # the window, just scroll as far as the body can be scrolled
    if bodyHeight-top < windowHeight
      top = bodyHeight - windowHeight

    # Only scroll if the body is greater than the window
    if bodyHeight > windowHeight
      $('html,body')
        .delay(delay)
        .velocity({scrollTop: top},{ duration:duration, easing:"easeInOutQuint"})
