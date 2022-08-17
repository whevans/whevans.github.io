var AAN = AAN || {};

Formstone.NoConflict();
AAN.nav_universal = function() {

  var namespace = 'header';

  var $doc = $(document);
  var $html = $('html');
  var $body = $('body');
  var $nav = $('.nav-universal-container');
  var $btnSiteSearch = $nav.find('.btn-site-search');
  var btnSiteSearchTextDefault = $btnSiteSearch.text();
  var btnSiteSearchTextHide = 'Hide Search';
  var $siteSearch = $nav.find('.site-search-container');
  var $btnPublications = $nav.find('.publications button')
  var $modal = $('.modal-publications');
  var $btnModalClose = $modal.find('.btn-close');
  var $loginModal = $('#login');
  var $btnLogin = $nav.find('.login button');

  init = function () {

    var closeModal = function () {
      $body.removeClass('modal-active-publications');
      $modal.siblings().each(function () {
        $(this)[0].inert = false;
      });
      $btnPublications.focus();
      $doc.off('keyup.publicationsModal');
    };

    $btnPublications.on('click', function () {
      $body.addClass('modal-active-publications');
      $modal.scrollTop(0);
      $modal.siblings().each(function () {
        $(this)[0].inert = true;
      });
      $btnModalClose.focus();

      $doc.on('keyup.publicationsModal', function (e) {
        if (e.keyCode === 27) {
          closeModal();
        }
      });
    });

    $btnModalClose.on('click', function () {
      closeModal();
    });

    $btnSiteSearch.on('click', function () {
      var $btn = $(this);
      if ($nav.hasClass('search-active')) {
        $nav.removeClass('search-active');
        $siteSearch.fadeOut('fast');
        $btn.text(btnSiteSearchTextDefault);
      }
      else {
        $nav.addClass('search-active');
        $btn.text(btnSiteSearchTextHide);
        $siteSearch.fadeIn('fast');
        $siteSearch.find('input[type="search"]').eq(0).focus();
      }
    });

    $btnLogin.on('click', function () {
      $loginModal.addClass('visible');
      $loginModal.animate({
        'opacity': 1,
      }, 500);

      $html.addClass('modal-open');
    });

    $loginModal.find('.overlay, .btn-close').on('click', function () {
      $loginModal.animate({
        'opacity': 0,
      }, 500, function () {
        $loginModal.removeClass('visible');
      });

      $html.removeClass('modal-open');
    });

    $loginModal.find("input[type='checkbox'], input[type='radio']").fsCheckbox();
  };

  self.init();

}(jQuery);

AAN.main_nav = function() {

  var namespace = 'main-nav';

  var $html = $('html');
  var $menu = $('#main-menu');
  var $menuBtn = $menu.find('.btn-nav-main');
  var $submenuTriggers = $menu.find('.icon-submenu-trigger');
  var $navButtons = $menu.find('> ul > li');

  init = function () {
    $menuBtn.on('click.' + namespace, function () {
      var $this = $(this);
      if (!$html.hasClass('menu-open')) {
        $this.find('span').html('Hide');
        $this.attr('aria-expanded', 'true');
      }
      else {
        $this.find('span').html('Display');
        $this.attr('aria-expanded', 'false');
      }
      $html.toggleClass('menu-open');
    });

    $submenuTriggers.on('click.' + namespace, function () {
      var $this = $(this);
      var $li = $this.closest('li');
      $this.blur();

      if (!$li.hasClass('submenu-open')) {
        var $openMenu = $menu.find('.submenu-open');
        $openMenu.toggleClass('submenu-open').find('.subnav').slideToggle(600);
        $openMenu.find('button').attr('aria-expanded', 'false').find('span').html('Display');
        $this.attr('aria-expanded', 'true').find('span').html('Hide');
      }
      else {
        $this.attr('aria-expanded', 'false').find('span').html('Display');
      }

      $li.find('.subnav').slideToggle(600, function () {
        $li.find('.subnav li').first().find('a').focus();
      });
      $li.toggleClass('submenu-open');
    });

    $.fsMediaquery("bind", "mq-key", "(min-width: 959px)", {
      enter: function() {
        $html.removeClass('menu-open');

        if (Modernizr.touchevents) {
          $navButtons.find('a').on('click.' + namespace, function (e) {
            e.stopPropagation();
            e.preventDefault();

            var $li = $(this).closest('li');

            if (!$li.hasClass('submenu-open')) {
              $menu.find('.submenu-open').removeClass('submenu-open');
              $li.addClass('submenu-open');
            }
            else {
              location.href = $(this).attr('href');
            }
          });
        }
        else {
          $navButtons.on('mouseenter.' + namespace, function (e) {
            var $this = $(this);

            if (!$this.hasClass('submenu-open')) {
              $('.subnav').removeAttr('style');
              $this.addClass('submenu-open');
            }
          });

          $navButtons.on('mouseleave.' + namespace, function (e) {
            var $this = $(this);

            if ($this.hasClass('submenu-open')) {
              $('.subnav').removeAttr('style');
              $this.removeClass('submenu-open');
            }
          });

          $menu.find('.subnav').removeAttr('style');
          $menu.find('.submenu-open').removeClass('submenu-open');
        }
      },
      leave: function() {
        $navButtons.off('mouseenter.' + namespace);
        $navButtons.off('mouseleave.' + namespace);
        $navButtons.find('a').off('click.' + namespace);
      }
    });
  };

  self.init();

}(jQuery);

AAN.multistepForm = function() {

  var $formContainer = $('#main').find('.multistep-form');

  function init() {

    $formContainer.find('fieldset.step').eq(0).removeClass('collapsed').find('.multistep-form-fields').slideDown();

    $('.multistep-form .step .button-next').on('click', function(){

      $error = false;

      $(this).parents('fieldset.step').find('input').each(function(){
        if ($(this)[0].checkValidity()) {
          $(this).parents(".field").removeClass('error');
        } else {
          $error = true;
          $(this).parents(".field").addClass('error');
        }
      });

      if ($error === true) {
        return false;
      }

      $(this)
        .parents('fieldset.step')
        .addClass('filled')
        .toggleClass('expanded')
        .toggleClass('collapsed')
        .find('.multistep-form-fields')
        .slideUp()
        .parents()
        .next('fieldset.step.collapsed')
        .toggleClass('expanded')
        .toggleClass('collapsed')
        .find('.multistep-form-fields')
        .slideDown();

      return false;

    });

    $('.multistep-form .step .button').on('click', function(){

      $error = false;

      $(this).parents('fieldset.step').find('input').each(function(){
        if ($(this)[0].checkValidity()) {
          $(this).parents(".field").removeClass('error');
        } else {
          $error = true;
          $(this).parents(".field").addClass('error');
        }
      });

      if ($error === true) {
        return false;
      }
    });

    $('.multistep-form .step .multistep-form-modify').on('click', function(){

      $formContainer.find('fieldset.step').addClass('collapsed').removeClass('expanded').find('.multistep-form-fields').slideUp();

      $(this)
      .parents('fieldset.step')
      .removeClass('filled')
      .addClass('expanded')
      .removeClass('collapsed')
      .find('.multistep-form-fields')
      .slideDown()

    });


    $('#IDoNotSeeMyMedicalSchoolListed, #IDoNotSeeMyResidencyLocationListed').on('click', function() {
      if($(this).is(':checked')) {
        $(this).parents('.field').next('.field').addClass('is-visible');
        $(this).parents('.field').next('.field').find('input').prop('disabled', false);
        $(this).parents('.field').next('.field').find('input').prop('required', true);
        $(this).parents('.secondary-element').find('select').prop('disabled', true);
      }
      else {
        $(this).parents('.field').next('.field').removeClass('is-visible');
        $(this).parents('.field').next('.field').find('input').prop('disabled', true);
        $(this).parents('.field').next('.field').find('input').prop('required', false);
        $(this).parents('.secondary-element').find('select').prop('disabled', false);
      }
    })
  }

  if ($formContainer.length) {
    init();
  }

}(jQuery);
AAN.slick_slider = function () {

  var $window = $(window);
  var $slick = $('.slick-slider');
  var $pagination = $('.slider-pagination');

  init = function () {
    if ($window.width() < 768) {
      $slick.slick({
        arrows: false,
        dots: true,
        appendDots: $pagination
      });
    }
  };

  if($slick.length) {
    self.init();
  }

}(jQuery);
AAN.alert = function() {

  var $alert = $('#main').find('.alert-container');

  init = function () {

    $alert.each(function () {
      var $this = $(this);
      $this.find('.btn-close').on('click', function () {
        $this.remove();
      });
    });
  };

  if ($alert.length) {
    self.init();
  }

}(jQuery);

AAN.seeMore = function () {

  var $seeMoreItems = $('.see-more');

  function init () {
    // loop through each see more item on the page
    $seeMoreItems.each(function(i, el) {
      $(el).data('initialheight', $(el).find('.text').height());
      $(el).on('click', 'button', function () {
        toggle(el);
      });

      // append the button
      $(el).append($('<button />')
        .attr('aria-expanded', false)
        .text($(el).data('showmorelabel'))
        .attr('aria-label', $(this).data('aria-label-show'))
      );
    });
  }

  function toggle (el) {

    var initialHeight = $(el).data('initialheight');
    var expandedHeight = $(el).find('.text-inner').innerHeight();

    // if the component is open
    if($(el).hasClass('is-open')) {

      $(el).find('.text').animate({
        height : initialHeight
      });

      $(el).find('button')
        .attr('aria-expanded', false)
        .attr('aria-label', $(el).data('aria-label-show'))
        .text($(el).data('showmorelabel'));

    // if the component is closed
    } else {

      $(el).find('.text').animate({
        height : expandedHeight
      }, function () {
        $(el).find('.text').css({
          height: 'auto'
        });
      });

      $(el).find('button')
        .attr('aria-expanded', true)
        .attr('aria-label', $(el).data('aria-label-hide'))
        .text($(el).data('showlesslabel'));
    }

    // toggle the is-open class
    $(el).toggleClass('is-open');

  }

  $(function () {
    // if there are see more items on the page
    if($seeMoreItems.length > 0) {
      init();
    }
  });

}(jQuery);
AAN.dateCarouselSlickSlider = function () {

  var $window = $(window);
  var $slick = $('.date-carousel .slickslider');

  init = function () {
    $slick.slick({
      //arrows: true,
      dots: false,
      infinite: true,
      slidesToShow: 7,
      slidesToScroll: 7,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            dots: false,
            infinite: true,
            slidesToShow: 7,
            slidesToScroll: 7
          }
        }
      ]
    });
    
    $('li.slick-slide').on('click', function(){
      $('li.slick-slide.slick-current').toggleClass('slick-current');
      $(this).toggleClass('slick-current');
    });
    
  };

  if($slick.length) {
    self.init();
  }

}(jQuery);
AAN.descriptionScroll = function () {

  var $scrollFollow = $('.scroll-follow'),
    $window = $(window),
    topPadding = $('.hdr-global').length > 0 ? $('.hdr-global').outerHeight() + 20 : 70,
    breakpoint = 960;

  var init = function () {
    if ($window.width() > breakpoint) {
      $scrollFollow.each(function () {
        var params = {
          element: $(this),
          elementOffset: $(this).offset(),
          parentHeight: $(this).parent().innerHeight(),
          elementHeight: $(this).outerHeight(),
          topPadding: topPadding
        };

        // Attaching event handler
        $window.scroll(params, scrollFollow);
        // Triggering handler once to align scroll-follow elements if page reloaded
        if ($window.scrollTop() > 0) {
          $window.triggerHandler('scroll');
        }
      });
    } else {

      // Cleaning up event handler and removing style attributes
      $scrollFollow.each(function () {
        $(this).removeAttr('style');
      });
      $window.off('scroll', scrollFollow);
    }
  };

  function scrollFollow(event) {
    var y = event.currentTarget.scrollY || event.currentTarget.pageYOffset;

    if (y > (event.data.elementOffset.top - event.data.topPadding)
      && (y - event.data.elementOffset.top + topPadding < (event.data.parentHeight - event.data.elementHeight))) {
      event.data.element.css({
        marginTop: y - event.data.elementOffset.top + event.data.topPadding
      });
    }
    else if (y < (event.data.elementOffset.top - event.data.topPadding)) {
      event.data.element.css({
        marginTop: 0
      })
    }
  }

  $(function () {
    // if there are items with scroll-follow on the page
    if ($scrollFollow.length > 0) {
      $window.resize(function () { init(); });
      init();
    }
  });

}(jQuery);
AAN.coursesOverlay = function() {

  var $courses = $('#main').find('.cme-moc-courses-container');

  function calcOverlay() {
    var $overlay = $courses.find('.member-only-overlay');

    $.fsMediaquery("bind", "mq-key", "(max-width: 959px)", {
      enter: function() {
        var $secondCourse = $courses.find('.course-items li.second-item');
        var $lastCourse = $courses.find('.course-items li:last-child');
        var $overlayMobileHeight = $secondCourse.outerHeight() + $lastCourse.outerHeight();
        $overlay.css('height', $overlayMobileHeight);
      },
      leave: function() {
        $overlay.css('height', '');
      }
    });
  }

  if ($courses.length) {
    calcOverlay();
  }

  $(window).resize(function () {
    calcOverlay();
  });

}(jQuery);
AAN.breadcrumbs = function () {

  var $breadcrumbs = $('nav.breadcrumbs');

  function init() {
    if ($breadcrumbs.find('ol li').length >= 2) {
      $breadcrumbs.find('ol li:nth-last-child(2)').addClass('back-to-link').text();
    }
    else {
      $breadcrumbs.hide();
    }
  }

  if ($breadcrumbs.length) {
    init();
  }

}(jQuery);
AAN.leftNav = function () {

  var $leftnav = $('#main').find('.left-nav');

  init = function () {
    // create dropdown select from list
    $('<select />').appendTo('.left-nav').attr('id', 'left-nav');

    // populate dropdown with menu items
    $('.left-nav a').each(function () {
      var el = $(this);
      $('<option />', {
        'value': el.attr('href'),
        'text': el.text()
      }).appendTo('.left-nav > select');
    });

    // get the value for the last breadcrumb and use as default selected item label
    var $lastCrumb = $('.breadcrumbs > ol li:last-child').text();

    // formstone dropdown
    $('.left-nav > select').fsDropdown({
      links: true,
      label: $lastCrumb
    });

    // add an accessibility label for select
    $('<label />').prependTo('.fs-dropdown').attr('for', 'left-nav').text('Side Navigation');
  };

  if ($leftnav.length) {
    self.init();
  }

}(jQuery);

AAN.pageNotFound = function() {

  var $pageNotFound = $('#main').find('.hero.page-not-found');

  function init() {
    checkSize();
    $(window).on('resize', function(){
      checkSize();
    });
  }
  
  function checkSize(){
    tmpHeight = $(window).height() - ($('.hdr-global').height() + $('.ftr-global-container').height());
    $pageNotFound.css('height', tmpHeight);
  }

  if ($pageNotFound.length) {
    init();
  }

}(jQuery);
AAN.scrollTabs = function() {

  var $courses = $('#main').find('.tabs');


  function init () {
    activeItem = $courses.find('.is-active');
    setActive(activeItem);
  }

  function setActive (item) {
    $courses.scrollLeft(item.position().left - item.outerWidth()/2);
    $('.tabs').scrollLeft($('.tab-menu li.is-active').position().left - (($(window).width() / 2) - ($('.tab-menu li.is-active').width() / 2)));
  }

  if ($courses.length) {
    init();
  }


}(jQuery);
AAN.scrollTop = function() {

var $button = $('.scroll-top-container .button-green');
var $showpoint = $(window).height()*2;
var $stickpoint = ($(document).height()-$(window).height())-290;
var $formActions = $('.form-actions-container');

  $(window).scroll(function () {
		if ($(window).scrollTop() > $showpoint) { $button.addClass('visible'); }
		if ($(window).scrollTop() > $stickpoint) { $button.addClass('stick'); }
		if ($(window).scrollTop() < $stickpoint) { $button.removeClass('stick'); }
		if ($(window).scrollTop() < $showpoint) { $button.removeClass('visible'); }
    if ($formActions.length) {
      $button.remove();
    }
	});

	// scroll body to 0px on click
	$button.click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});


  // hides scroll to top for mobile if form actions exist
  function hideScrollTop() {
    $.fsMediaquery("bind", "mq-key", "(max-width: 767px)", {
      enter: function() {
        $('.scroll-top-container').hide();
        $button.removeClass('visible stick');
      },
      leave: function() {
        $('.scroll-top-container').show();
      }
    });
  }

  $(window).resize(function () {
    hideScrollTop();
  });

}(jQuery);
AAN.showAbstract = function() {

  var $abstractContainer = $('#main').find('.search-results .abstract-container');

  function init() {
    $abstractContainer.each(function (i, el) {
      $(el).on('click', '.show-abstract-toggle', function (e) {
        var $this = $(this),
            $abstract = $this.next();

        e.preventDefault();

        // reset all abstracts
        $('.search-results .show-abstract-toggle').removeClass('is-open').find('a').text('Show Abstract').attr('aria-label', 'Show Abstract');
        $('.search-results .abstract-text').slideUp();

        // abstract opens one at a time
        if ($this.hasClass('is-open') && ($abstract.is(':visible'))) {
          $this.removeClass('is-open').find('a').text('Show Abstract').attr('aria-label', 'Show Abstract');
          $abstract.slideUp(400);
        }

        if (!($this.hasClass('is-open')) && (!($abstract.is(':visible')))) {
          $this.addClass('is-open').find('a').text('Hide Abstract').attr('aria-label', 'Hide Abstract');
          $abstract.slideDown(400);
        }
      });
    });
  }

  if ($abstractContainer.length) {
    init();
  }

}(jQuery);
AAN.tablesClickableRow = function() {
  $('.col-collapse tr').on('click', function() {
    if($(this).find('a').attr('href')) {
      window.location = $(this).find('a').attr('href');
    }
  });

  $('.col-collapse tr').on('mouseover', function() {
    if($(this).find('a').attr('href')){
      $(this).addClass('hover');
    }
  });

  $('.col-collapse tr').on('mouseout', function() {
    if($(this).find('a').attr('href')){
      $(this).removeClass('hover');
    }
  });
}(jQuery);
AAN.showMore = function() {

  var $moreLink = $('.layout-sidebar.left a#js-show-more');

  function init() {
    $($moreLink).on('click', function (e) {
      if($('.layout-sidebar.left .cut').hasClass('open')) {
        $('.layout-sidebar.left .cut').hide().removeClass('open');
        $moreLink[0].innerText = 'Show more';
      } else {
        $('.layout-sidebar.left .cut').show().addClass('open');
        $moreLink[0].innerText = 'Show less';
      }
    });
  }

  if ($moreLink.length) {
    init();
  }

}(jQuery);
AAN.showAccordion = function() {

  var $accordionContainer = $('#main').find('.accordion-container');

  function init() {
    $('.accordion-header').on('click', function(){
      // abstract opens one at a time
      if ($('.accordion-list>ul').hasClass('is-open')) {
        $('.accordion-list>ul').removeClass('is-open').slideUp(400);
      } else {
        $('.accordion-list>ul').addClass('is-open').slideDown(400);
      }
    })
  }

  if ($accordionContainer.length) {
    init();
  }

}(jQuery);
AAN.dropdown = function() {

  var $dropdown = $('.dropdown');

  function init($this) {
    var $trigger = $this.find('.dropdown-trigger');
    var $content = $this.find('.dropdown-content');
    var $html = $('html');
    var $document = $(document);

    $trigger.on('click keyup', function (e) {
      e.preventDefault();

      if(e.type === 'click' || e.keyCode === 13 || e.keyCode == 32) {
        $('.dropdown-content').not($(this).next()).removeClass('visible');
        var triggerClass = $trigger.hasClass('active');
        if (triggerClass) {
          $trigger.removeClass('active');
        } else {
          $trigger.addClass('active');
        }
        $content.toggleClass('visible');
        $html.attr('data-scrollpos', $(window).scrollTop());
        $html.toggleClass('modal-open');
        $html.removeClass('menu-open');
      }
    });

    $document.on('click.dropdown', function (e) {
      if (!$(e.target).closest('.dropdown').length) {
        $content.removeClass('visible');
        $trigger.removeClass('active');
      }
    });

    $content.find('.cancel, .btn-close').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      $content.find('input').each(function () {
        $(this).val('');
      });

      $content.find('.fs-checkbox-checked').each(function () {
        $(this).click();
      });

      $content.toggleClass('visible');
      $html.removeClass('modal-open');

      if ($(window).width() < 960) {
        $('html, body').scrollTop($html.data('scrollpos'));
      }
    });

    $content.find('.apply').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      $content.toggleClass('visible');
      $html.removeClass('modal-open');

      if ($(window).width() < 960) {
        $('html, body').scrollTop($html.data('scrollpos'));
      }
    });
  }

  if ($dropdown.length) {
    $dropdown.each(function () {
      init($(this));
    })
  }

}(jQuery);
AAN.formstoneElements = function() {
  $("input[type='radio']").fsCheckbox();
  $('#start-date').datepicker();
  $('#end-date').datepicker();
  var checkboxes = $("input[type='checkbox']").filter(function(){
    return !$(this).closest('.interests-area').length;
  });
  $(checkboxes).fsCheckbox();
}(jQuery);
AAN.convertCats = function() {

  var $cats = $('.categories-list .search-results-categories');

  function init() {
    // create select dropdown
    var $select = $('<select />');
    $select.appendTo(".categories-list");

    // populate dropdown with list items
    $(".categories-list .search-results-categories a").each(function() {
     var el = $(this);
     $("<option />", {
         "value"   : el.attr("href"),
         "text"    : el.text()
     }).appendTo($select);
    });

    // replace categories list with select
    $cats.replaceWith($select);

    // add an id to select
    $select.attr('id', 'categories');

    // set the first option as selected
    $select.removeAttr('selected').find('option:first').attr('selected', 'selected');
    $select[0].selectedIndex = 0;
  }

  if ($cats.length) {
    init();
  }

}(jQuery);
























