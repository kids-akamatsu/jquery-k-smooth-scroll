(function ($) {
  var options;
  $.fn.extend({
    kSmoothScroll: function (newOptions) {
      var defaults = {
        duration: 1000,
        easing: "swing",
        fixedHeaderHeight: 0,
        fixedHeaderSelector: ".header-offset:visible",
        // locationHashScrollDuration: 100, 指定しなければdurationを使う
        locationHashScrollDelay: 0,
      };
      options = $.extend(defaults, newOptions);

      $(this)
        .find('a[href*="#"]')
        .not('a[href^="http://"]')
        .not('a[href^="https://"]')
        .not(".no-smooth-scroll")
        .on('click', function () {
          var href = $(this).attr("href");
          var target;
          var m;
          if (href.match(/^#/)) {
            target = $(href === "#" ? "html" : href);
          } else if (
            $(this).prop("href").replace(/#.*$/, "") ===
            location.href.replace(/#.*$/, "")
          ) {
            // hash 付きのURLからhashを取ったものが同じ => 同一ページのとき
            if ((m = href.match(/(#.*)$/))) {
              target = $(m[1]);
            }
          }
          if (target && target.length > 0) {
            $.fn.kSmoothScrollToElement(target);
            return false;
          } else {
            // ページを遷移させる
            return true;
          }
        });
      // 外部リンク対応
      $.fn.kSmoothScrollToLocationHash();

      return this;
    },
    kSmoothScrollToElement: function (target, newOptions) {
      var o = $.extend(options, newOptions);
      var headerElement = $(o.fixedHeaderSelector);
      var headerHeight = o.fixedHeaderHeight;
      if (headerHeight === 0 && headerElement.length > 0) {
        $(o.fixedHeaderSelector).outerHeight();
      }
      var position = target.offset().top - headerHeight;
      $("html, body").stop().animate(
        {
          scrollTop: position,
        },
        o.duration,
        o.easing
      );
      return this;
    },
    kSmoothScrollToLocationHash: function () {
      var o = options;
      var m = location.hash.match(/^(#.+)$/);
      if (m) {
        $("body,html").stop().scrollTop(0);
        var targetSelector = m[1];
        setTimeout(function () {
          $.fn.kSmoothScrollToElement(
            $(targetSelector),
            "locationHashScrollDuration" in o
              ? o.locationHashScrollDuration
              : o.duration
          );
        }, o.locationHashScrollDelay);
      }
      return this;
    },
  });
})(jQuery);
