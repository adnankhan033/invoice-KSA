(function() {

  var stickyElement = jQuery(".sticky"),
      stickyClass = "sticky-pin",
      stickyPos = 66, //Distance from the top of the window.
      stickyHeight;



  ///Create a negative margin to prevent content 'jumps':
  stickyElement.after('<div class="jumps-prevent"></div>');

  function jumpsPrevent() {
      stickyHeight = stickyElement.innerHeight();
      stickyElement.css({ "margin-bottom": "-" + stickyHeight + "px" });
      stickyElement.next().css({ "padding-top": +stickyHeight + "px" });
  };
  jumpsPrevent(); //Run.

  //Function trigger:
  jQuery(window).resize(function() {
      jumpsPrevent();
  });

  //Sticker function:
  function stickerFn() {
      var winTop = jQuery(this).scrollTop();
      //Check element position:
      winTop >= stickyPos ?
          stickyElement.addClass('stickyClass') :
          stickyElement.removeClass('stickyClass') //Boolean class switcher.
  };
  stickerFn(); //Run.

  // function stickerhoverFn(hover) {
  //     var winTop = jQuery(this).scrollTop();
  //     //Check element position:
  //     winTop >= stickyPos ?
  //         hover.addClass('sidemenu-scroll') :
  //         hover.removeClass('sidemenu-scroll') //Boolean class switcher.
  // };
  // let hoverSubmenu = jQuery('.hover-submenu .main-sidebar')
  // let hoverSubmenu1 = jQuery('.hover-submenu1 .main-sidebar')
  // stickerhoverFn(hoverSubmenu)
  // stickerhoverFn(hoverSubmenu1)
  //     //Function trigger:
  jQuery(window).scroll(function() {
      stickerFn();
      // stickerhoverFn(hoverSubmenu)
      // stickerhoverFn(hoverSubmenu1)
  });

})();

// sidemenu
(function() {
  jQuery('.app-sidebar').scroll(function() {
      var s = jQuery(".app-sidebar .ps__rail-y");
      if (s[0].style.top.split('px')[0] <= 60) {
          jQuery('.app-sidebar').removeClass('sidemenu-scroll')
      } else {
          jQuery('.app-sidebar').addClass('sidemenu-scroll')
      }

  })
})();