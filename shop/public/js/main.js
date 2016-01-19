var app = new Framework7({
  pushState: true,
  //animatePages: false,
  //pushStateNoAnimation: true,
  swipeBackPage: false,
  hideNavbarOnPageScroll: true,
  notificationTitle:'提示'
});

var $$ = Framework7.$;

var mainView = app.addView('.view-main', {
  dynamicNavbar: true
});
