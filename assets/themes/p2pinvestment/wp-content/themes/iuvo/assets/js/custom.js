/**
 * @Author: Ivan Iliev
 * @Date:   2019-04-05T12:11:01+03:00
 * @Email:  i.iliev@softart.bg
 * @Filename: custom.js
 * @Last modified by:   Ivan Iliev
 * @Last modified time: 2019-04-24T15:52:45+03:00
 */


(function($) {


	initSwitch();

	$(window).resize(function() {
		clearTimeout(this.id);
		this.id = setTimeout(resizeSwitch, 250);
	});

	function createCookie(name,value,days) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}

	function eraseCookie(name) {
	    createCookie(name,"",-1);
	}

	function initSwitch() {

		globalInit();
		//var $window = $(window);

		if((window.innerWidth >= 320) && (window.innerWidth < 768)) {
			smartInit();
		} // 320 >= window < 768

		if((window.innerWidth >= 768) && (window.innerWidth < 1280)) {
			tabletInit();
		} // 768 >= window < 1280

		if((window.innerWidth >= 1280)) {
			desktopInit();
		} // window >= 1280

	}

	function resizeSwitch() {

		//globalResize();

		if((window.innerWidth >= 320) && (window.innerWidth < 768)) {
			//smartResize();
		} // 320 >= window < 768

		if((window.innerWidth >= 768) && (window.innerWidth < 1280)) {

			if ((window.innerWidth >= 768) && (window.innerWidth < 1201)){
				$($('#user-menu .add-funds, #user-menu .withdraw').detach()).appendTo('#left-menu');
			} else {
				$($('#left-menu .add-funds, #left-menu .withdraw').detach()).prependTo('#user-menu');

				//Init home page navigation
				var $navigation = $('.iuvo-navbar');
				var $header = $('header');
				var mainMenuTop = $navigation.offset().top + ($navigation.height() / 2);

				$(window).on({
					'touchmove': function (e) {
				        if ($header.offset().top <= (mainMenuTop * -1)) {
				            $('.iuvo-navbar').addClass('fixed');
				        } else {
				            $('.iuvo-navbar').removeClass('fixed');
				            $('.tabs_wrap').removeClass('is_stuck');
				        }
					},
					'scroll': function () {
				        if ($(window).scrollTop() > mainMenuTop) {
				            $('.iuvo-navbar').addClass('fixed');
				        } else {
				            $('.iuvo-navbar').removeClass('fixed');
				            $('.tabs_wrap').removeClass('is_stuck');
				        }
					}
				});
			}

		} // 768 >= window < 1280

		if((window.innerWidth >= 1280)) {
			//desktopResize();
		} // window >= 1280

	} //resizeSwitch


	function globalInit(){
		// console.log('global init');

		//AJAX request function
		var ppp = 10;
		var pageNumber = 0;
		var load_posts_cookie = 0;

		function load_posts(exclude, cat_id, tag_id, search_str, reload = true) {
		    pageNumber++;
		    var str = '&exclude=' + exclude.toString() + '&pageNumber=' + pageNumber + '&ppp=' + ppp + '&action=more_post_ajax' + '&cat=' + cat_id + '&tag=' + tag_id + '&search=' + search_str;
				if (!reload) {
					str += '&has_more_post=true';
				}

		    $.ajax({
		        type: "POST",
		        dataType: "html",
		        url: ajax_posts.ajaxurl,
		        data: str,
		        success: function(data){
		        	var $data = $.parseHTML(data);
							if (!reload) {
								if (!$data) {
									$('#more_posts').hide();
								}
								return;
							}
		            if($data){
									if (reload) {
										var has_more_post = load_posts(exclude, cat_id, tag_id, search_str, reload = false);
										pageNumber--;
									}

		              $('#ajax-posts').append($data);
									$('#more_posts').appendTo('#ajax-posts');
		              $('#more_posts a').removeClass('loading');

		              if (readCookie('load_posts')) {
			            	load_posts_cookie = parseInt(readCookie('load_posts')) + parseInt(ppp);
			            }else {
			            	load_posts_cookie = 3 + parseInt(ppp);
			            }
			            // expere 0.5h - 0.02 day
			            createCookie('load_posts', load_posts_cookie, 0.02)
		            } else if (reload) {
		            	$('#more_posts').hide();
		            }
		        },
		        error : function(jqXHR, textStatus, errorThrown) {
		            $loader.html(jqXHR + " :: " + textStatus + " :: " + errorThrown);
		        }

		    });
		    return false;
		}

		//AJAX Request Trigger
		$("#more_posts a").on("click",function(ev){ // When btn is pressed.
			ev.preventDefault();
			$('#more_posts a').addClass('loading');
			let offset_top_more_btn = $('#more_posts a').offset().top;
			var exclude = $("input.exclude").data("assessments");
			var cat = $("input.cat_id").val();
			var tag = $("input.tag_id").val();
			var search_str = $("input.search_str").val();
			load_posts(exclude, cat, tag, search_str);
		});


		var height_article_profile = $('.page-template-page-about .profile').innerHeight();
		//Profile Toggle More
		$('.about article.profile a.toggler').click(function(ev) {
			ev.preventDefault();
			var $cont = $(this).closest('article');
			$('.about article.profile a.toggler').html('+');
			if($( window ).width() > 479) {
				$('.page-template-page-about .profile').height(height_article_profile);
			}
			$('.page-template-page-about .profile').css('float', 'left');

			if( $cont.hasClass('opened') ){
				$(this).html('+');
				$cont.removeClass('opened');
				if($( window ).width() > 479) {
					$cont.height(height_article_profile);
					$('.page-template-page-about .profile').css('float', 'none');
				}
			} else {
				$('.page-template-page-about .profile').removeClass('opened');
				var offset_top = $cont.offset().top;
				if($( window ).width() > 479) {
					$('.page-template-page-about .profile').height(height_article_profile);
						var offset_top_box = offset_top + height_article_profile;
						$("html, body").animate({ scrollTop: offset_top - 70 }, 700);
						$cont.children('.additional-details').css('top', offset_top_box);
						if($( window ).width() >1280) {
							$cont.height(height_article_profile*2 - 72);
						}else if($( window ).width() < 768) {
							$cont.height(height_article_profile*2 - 50);
						}else {
							$cont.height(height_article_profile*2);
						}

				}else {
					var mobile_scroll = (offset_top + height_article_profile) - 60;
					$("html, body").animate({ scrollTop: mobile_scroll }, 700);
				}
				$(this).html('-');
				$cont.addClass('opened');
			}
		});

		$('.about article.profile .additional-details .close').click(function(ev) {
			ev.preventDefault();
			var $cont = $(this).closest('article');

			$('.about article.profile a.toggler').html('+');
			if($( window ).width() > 479) {
				$cont.height(height_article_profile);
				$('.page-template-page-about .profile').css('float', 'none');
			}
			$cont.removeClass('opened');
		});


		//Replace flags with language short code
		/*$('.qtranxs-lang-menu img[alt="English"]').parent().html('En');
		$('.qtranxs-lang-menu img[alt="Eesti"]').parent().html('Et');
		$('.qtranxs-lang-menu img[alt="Български"]').parent().html('Bg');
		$('.qtranxs-lang-menu img[alt="Deutsch"]').parent().html('De');*/

		//Remove mobile close menu button text
		$('.iuvo-navbar .menu .bttn-close a').html('');

		// Open tab from external link. Remove hash from URL. Depricated.
		//history.pushState("", document.title, window.location.pathname + window.location.search);

		//Video player embed
		$('.video .player').click(function(ev){
			ev.preventDefault();
			$(this).hide();
			$('.video iframe').attr('src', $('.video iframe').attr('src') + '&autoplay=1').css('display', 'block');
		})

		//Registration form switch
		$('.tab-nav input[name="reg-type"]').change(function(){
			if (this.value == 'Individual') {
	            $('#individual-wrap').show();
	            $('#company-wrap').hide();
	        }
	        else if (this.value == 'Company') {
	            $('#company-wrap').show();
	            $('#individual-wrap').hide();
	        }
		});


		//Init FAQ tab navigation
		$('.faq-tabs .accordion h2').click(function() {
			$('.faq-tabs .accordion div').slideUp();
			$('.faq-tabs .accordion h2').removeClass('open');
			if ($(this).next('div').css('display') != 'block') {
				$(this).addClass('open');
				$(this).next('div').slideDown();
			}
		});

		$('.faq-tabs .wide-screen-nav li a').click(function() {
			var attr_href = $(this).attr('href');
			hash = attr_href.split('#')[1];
			if(!hash) {
				window.open(attr_href,"_self");
			}
		});

		$('.page-template-page-faq-child .ui-state-active-new a').trigger('click');


		//Init Market, Contacts, and Blog tab navigation
		$('.market-tabs, .contact-tabs, .profile-tabs').tabs({
			show: {effect:'fade', duration:'fast'},
			hide: {effect:'fade', duration:'fast'}
		});

		//Registration steps
		regSlider = $('.page-template-page-register-steps .bxslider ul').bxSlider({
			controls:false,
			minSlides:1,
			maxSlides:1,
			mode:'fade',
			pager:false,
			touchEnabled:false
		});


		$('.step-2of3 .bck-btn, .step-2of4 .bck-btn').click(function(ev){
			ev.preventDefault();
			regSlider.goToSlide(0);
		});
		$('.step-3of3 .bck-btn').click(function(ev){
			ev.preventDefault();
			regSlider.goToSlide(1);
		});
		$('.step-3of4 .bck-btn').click(function(ev){
			ev.preventDefault();
			regSlider.goToSlide(3);
		});
		$('.step-4of4 .bck-btn').click(function(ev){
			ev.preventDefault();
			regSlider.goToSlide(4);
		});
		// $('.registration .get-started').click(function(ev){
		// 	ev.preventDefault();
		// 	var regType = $('.registration input[name="reg-type"]:checked').val();
		// 	if(regType == 'Individual') {
		// 		regSlider.goToSlide(1);
		// 	} else if (regType == 'Company') {
		// 		regSlider.goToSlide(3);
		// 	}
		// });
		// $('.registration .next').click(function(ev){
		// 	ev.preventDefault();
		// 	regSlider.goToNextSlide();
		// });


	} //globalInit

	function smartInit(){
		console.log('smart init');

		//Init site navigation
		$('.iuvo-navbar #site-navigation .bttn-bars').click(function(ev){
			ev.preventDefault();
         $(this).parent().addClass('open');
         $('html').css('overflow-y', 'hidden');
         $('html').css('height', '100%');
         $('body').css('overflow-y', 'hidden');
         $('body').css('height', '100%');
		});
		$('.iuvo-navbar #site-navigation .bttn-close').click(function(ev){
			ev.preventDefault();
         $(this).closest('#site-navigation').removeClass('open');
         $('html').css('overflow-y', '');
         $('html').css('height', '');
         $('body').css('overflow-y', '');
         $('body').css('height', '');
		});

		$(document).on('click touchstart', function () {
			$('.iuvo-navbar #p2p_navigation.left-navigation').removeClass('open');
			$('body').removeClass('navopen');
		});

		$('#p2p_navigation .left-menu, .iuvo-navbar #p2p_navigation .bttn-bars').on('click touchstart', function (e) {
			e.stopPropagation();
		});

		//Init left navigation
		$('.iuvo-navbar #p2p_navigation .bttn-bars').click(function(ev){
			ev.preventDefault();
			if($(this).closest('.left-navigation').hasClass('open')) {
				$(this).closest('.left-navigation').removeClass('open');
				$('body').removeClass('navopen');
			} else {
				$(this).closest('.left-navigation').addClass('open');
				$('body').addClass('navopen');
			}
		});

		//DOM manipulations
		$($('#user-menu .add-funds, #user-menu .withdraw').detach()).appendTo('#left-menu');
		$balance = $('.user-menu #balance');
		if($balance.length) {
			$($('#balance').detach()).prependTo('#left-menu').wrap('<li class="balance"></li>');
		}

		//Init Quotes carousel
		$('.quotes .bxslider ul').bxSlider({
			controls:false,
			minSlides:1,
			maxSlides:1,
			pagerCustom:'.pager-custom',
			mode:'fade',
			auto: true,
			pause: 7000,
			autoHover: true
		});

		//Init Backers carousel
		$('.backers.bxslider ul').bxSlider({
			pager: false,
			minSlides:1,
			maxSlides:1,
			mode:'fade',
			nextText:'',
			prevText:'',
			auto: true,
			pause: 7000,
			autoHover: true
		});

		//Mobile navigation - dropdown instead tabs
		$('select.mobile-nav').selectmenu({
			  change: function(event, ui) {
				  $('.ui-tabs').tabs('option','active', $(this).val());

				  if(ui.item.label == "Primary Market") $('#tbp2p_primary_market_pub_page').trigger('click');
				  if(ui.item.label == "Secondary Market") $('#tbp2p_secondary_market_pub_page').trigger('click');
				  if(ui.item.label == "Recent Activity") $('#tbp2p_platform_activity_pub_page').trigger('click');
			  }
		});

		//Mobile navigation - dropdown instead tabs
		$('select.mobile-js-nav').selectmenu({
			  change: function(event, ui) {
				  var url = $(this).val();
		          if (url) {
		              window.location = url;
		          }
		          return false;
			  }
		});

		var all_blog_cat = $('#tab-navigation-cat ul li a');
		for (var i=0;i<all_blog_cat.length; i++) {
			var href_cat = all_blog_cat[i].href;
			all_blog_cat[i].href = href_cat + '#tab-navigation-cat';
		}

		if (window.location.hash == '#tab-navigation-cat') {
			$('html, body').animate({
				scrollTop: $('#tab-navigation-cat').offset().top - 70
		  }, 300);
		}

	} //smartInit

	function tabletInit(){

		//Init site navigation
		$('.iuvo-navbar #site-navigation .bttn-bars.mobile').click(function(ev){
			ev.preventDefault();
			$(this).parent().addClass('open');
		});
		$('.iuvo-navbar #site-navigation .bttn-close').click(function(ev){
			ev.preventDefault();
			$(this).closest('#site-navigation').removeClass('open');
		});

		//Init left navigation
		$('.iuvo-navbar #p2p_navigation .bttn-bars').click(function(ev){
			ev.preventDefault();

			if($(this).closest('.left-navigation').hasClass('open')) {
				$(this).closest('.left-navigation').removeClass('open');
				$('body').addClass('collapsed-left-menu');
				localStorage.setItem('navState', 'collapsed');
			} else {
				$(this).closest('.left-navigation').addClass('open');
				$('body').removeClass('collapsed-left-menu');
				localStorage.setItem('navState','expanded');
			}

		});


		if((window.innerWidth >= 768) && (window.innerWidth < 1201)){

			//DOM manipulations in portrait mode
			$($('#user-menu .add-funds, #user-menu .withdraw').detach()).appendTo('#left-menu');

		} else {

			//DOM manipulations in portrait mode
			$($('#left-menu .add-funds, #left-menu .withdraw').detach()).appendTo('#user-menu');

			//Init home page navigation
			var $navigation = $('.iuvo-navbar');
			var $header = $('header');
			var mainMenuTop = $navigation.offset().top + ($navigation.height() / 2);

			$(window).on({
				'touchmove': function (e) {
			        if ($header.offset().top <= (mainMenuTop * -1)) {
			            $('.iuvo-navbar').addClass('fixed');
			        } else {
			            $('.iuvo-navbar').removeClass('fixed');
			        }
				},
				'scroll': function () {
			        if ($(window).scrollTop() > mainMenuTop) {
			            $('.iuvo-navbar').addClass('fixed');
			        } else {
			            $('.iuvo-navbar').removeClass('fixed');
			        }
				}
			});

		}

		//Init Quotes carousel
		$('.quotes .bxslider ul').bxSlider({
			controls:false,
			minSlides:1,
			maxSlides:1,
			pagerCustom:'.pager-custom',
			mode:'fade',
			auto: true,
			pause: 7000,
			autoHover: true
		});

		//Init Backers carousel
		$('.backers.bxslider ul').bxSlider({
			pager: false,
			minSlides:1,
			maxSlides:1,
			mode:'fade',
			nextText:'',
			prevText:'',
			auto: true,
			pause: 7000,
			autoHover: true
		});

	} //tabletInit

	function desktopInit(){
		//console.log('desktop init');

		//Init home page navigation
		var $navigation = $('.iuvo-navbar');
		var $header = $('header');
		var mainMenuTop = $navigation.offset().top + ($navigation.height() / 2);

		$(window).on({
			'touchmove': function (e) {
		        if ($header.offset().top <= (mainMenuTop * -1)) {
		            $('.iuvo-navbar').addClass('fixed');
		        } else {
		            $('.iuvo-navbar').removeClass('fixed');
		        }
			},
			'scroll': function () {
		        if ($(window).scrollTop() > mainMenuTop) {
		            $('.iuvo-navbar').addClass('fixed');
		        } else {
		            $('.iuvo-navbar').removeClass('fixed');
		        }
			}
		});

		//Init left navigation
		$('#p2p_navigation .switch button').click(function(ev){
			ev.preventDefault();
			if($('body').hasClass('collapsed-left-menu')) {
				$('body').removeClass('collapsed-left-menu');
				localStorage.setItem('navState','expanded');
			} else {
				$('body').addClass('collapsed-left-menu');
				localStorage.setItem('navState', 'collapsed');
			}
		});

		//Restore previous navigation state
		if (localStorage.getItem('navState') !== null) {
		   if(localStorage.getItem('navState') == 'collapsed'){
			   $('body').addClass('collapsed-left-menu');
		   } else {
			   $('body').removeClass('collapsed-left-menu');
		   }
		}

		//Init Quotes carousel
		$('.quotes .bxslider ul').bxSlider({
			controls:false,
			minSlides:1,
			maxSlides:1,
			slideWidth:940,
			slideMargin:250,
			pagerCustom:'.pager-custom',
			mode:'fade',
			auto: true,
			pause: 7000,
			autoHover: true
		});

		//Init Backers carousel
		$('.backers.bxslider ul').bxSlider({
			pager: false,
			minSlides:1,
			maxSlides:1,
			slideWidth:882,
			mode:'fade',
			nextText:'',
			prevText:'',
			auto: true,
			pause: 7000,
			autoHover: true
		});

	} //desktopInit

	if($(window).width() < 800) {
		$('.ui-tabs-tab').click(function() {
			var href = $(this).children('a').attr("href");
			if(href == '#documents' || href == '#notifications') {
				$('.panel.panel-default.profile-complete').hide();
			}else {
				$('.panel.panel-default.profile-complete').show();
			}
		});
	}

})( jQuery );

$(document).ready(function () {
	// new code
	$('#pid-docs-cancel-verification-btn').click(function() {
		$('html, body').animate({
	        scrollTop: $('#pid-docs-view-mode').offset().top - 60
	    }, 1000);
	});

	$( "select.form-control" ).wrap( "<div class='select_box'></div>" );
	//$( "#individualConfirmTerms" ).wrap( "<div class='checkbox_cont'></div>" );
	$( ".page-template-page-register-steps .form-row select" ).wrap( "<div class='select_box'></div>" );

	$('#p2p_login_form_login_btn').click(function() {
		setTimeout(function() {
			if ( $('#p2p_login_form_err').is(':empty') ) {
				$('#p2p_login_form_err').removeClass('show');
			}else {
				$('#p2p_login_form_err').addClass('show');
			}
		}, 200)
	});

	$(".iuvo-navbar nav .user-menu #balance").delay(700).queue(function(next) {
	  	$(this).addClass("balance_active");
	  	next();
	});
	var $headerHeight = $('.iuvo-navbar').height();
		$(function() {
			$('a[href*="#"]:not([href="#"]):not(.continue_link_btn)').click(function() {
				if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
					var target = $(this.hash);
		        	target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
					if (target.length) {
						$('html, body').animate({
						scrollTop: target.offset().top -($headerHeight + 20)
						}, 600);
							return false;
					}
				}
			});
		});

});
jQuery(document).ready(function(){
	(function($) {

		function switchModePanel(selector) {
	        var $items = $(selector);
	        $('#documents ' + selector + ' .panel-heading .row .edit-link').click(function(ev){
	            ev.preventDefault();

	            $('#documents .panel.panel-default .panel-body').hide();
	            $('#documents .panel-heading .row .edit-link').show();
	            $('#documents ' + selector + ' .panel-heading .row .edit-link').hide();
	            $('#documents ' + selector + ' .panel-body').show();
	        });
	    };

	    switchModePanel('.pid-docs-edit-register');
	    switchModePanel('.pid-docs-edit-contract');
	    switchModePanel('.pid-docs-edit-mode');
	    switchModePanel('.pid-docs-view-mode');

	    if ($('#pid-docs-edit-mode').is(':hidden')) {
	        $('.pid-docs-edit-register .panel-body, .pid-docs-edit-contract .panel-body').show();
	        $('.pid-docs-edit-register .panel-heading .edit-link, .pid-docs-edit-contract .panel-heading .edit-link').hide();
	    }

	    function switchMode_2(selector) {
            $(selector + '.profile-row .edit-link').click(function(ev){
                ev.preventDefault();
                $('.row.profile-row').show();
                $('.edit-mode.form-horizontal').hide();
                $(selector + '.edit-mode').show();
                $(selector).not('li, .edit-mode').hide();
            });
        }

	    switchMode_2('.username');
        switchMode_2('.email');
        switchMode_2('.password');
        switchMode_2('.preferred-language');
        switchMode_2('.name');
        switchMode_2('.gender');
        switchMode_2('.citizenship');
        switchMode_2('.phone');
        switchMode_2('.address');
        switchMode_2('.date-of-birth');
        switchMode_2('.field-of-work');
        switchMode_2('.seniority-level');
        switchMode_2('.annual-income');
        switchMode_2('.origin-income');
        switchMode_2('.planned-investment');

        switchMode_2('.nickname');
        switchMode_2(".ubo1");
        switchMode_2(".ubo2");
        switchMode_2(".ubo3");
        switchMode_2(".ubo4");
        switchMode_2(".industry");
        switchMode_2(".employees");
        switchMode_2(".annual-income");
        switchMode_2(".ident-code");
        switchMode_2(".company-name");
        switchMode_2(".peps-field");

        $('.file_input_btn').click(function(event) {
        	event.preventDefault();
        	event.stopPropagation();
        	$(this).siblings('input.file_input').click();
        });

		$('input.file_input').change(function(){
		    var file = this.files[0].name;
		    $(this).siblings('.file_input_btn').text(file);
		});

		$('#successModal').on('shown.bs.modal', function (e) {
			setTimeout(function() {
				$('#successModal').modal('hide');
			}, 2000)
		});

		// var more_posts = $('#more_posts');
		// var footer_height = $('.blog #colophon').innerHeight();
		// var window_height = window.innerHeight;
		// $(window).scroll(function (event) {
	  //   var scroll = $(window).scrollTop();
	  //   more_posts_top = $(document).height() - (footer_height + window_height);
	  //   if(scroll > more_posts_top && !more_posts.children('a').hasClass('loading')) {
	  //   	more_posts.children('a').trigger( "click" );
	  //   }
    // });

		$('#scroll_to_top').click(function() {
			$("html, body").animate({ scrollTop: 0 }, 1000);
		});

		setTimeout(function() {
	    	$(".page-template-page-cart input").click(function () {
			   $(this).select();
			});
	    }, 500);

	   	setTimeout(function() {
			$('.primary-market .p2p-primary-market-loans .input-group .p2p-input').on('input', function() {
		   		var loanInvestAmount = Number($(this).val());
			  	var loanMinInvestAmount = Number($(this).data('min_invest_amount'));
			  	if (loanInvestAmount >= loanMinInvestAmount) {
			   	 	$(this).removeClass('error_amount');
			  	} else {
			    	$(this).addClass('error_amount');
			  	}
		   	});
	    }, 2000);

	})(jQuery);
});


$(window).load(function(e){

	// script for js pages
	if( $('#p2p_cont').length > 0)
	{
		if ($(window).width() < 768)
    	{
			$(document).on('click touchstart', function () {

				$('#p2p_open_saved_filters_btn').siblings('span').addClass('click_filter');
			    $('.click_filter').click(function() {
			    	$('#p2p_open_saved_filters_btn').click();
			    });

			    $('.modal, .modal.tb-modal > span').click(function() {
			    	if ( !$('.modal').hasClass('in') )
			    	{
			    		setTimeout(function() {
			    			$('body').removeClass('modal-open');
			    		}, 400);
			    	}
			    });

		    	function input_click() {
		    		$("input.p2p-input-decimal").focus(function() {
					    $('#backToTopBtn, .panel.panel-default').hide();
					}).blur(function() {
					    $('#backToTopBtn, .panel.panel-default').show();
					});
		    	}

		    	input_click();

		    	$('.nav-tabs .p2p-cart-nav').click( function() {
		    		setTimeout( function() {
		    			input_click();
		    		}, 1000);
		    	});


		        $('#p2p_view_filters_btn').click(function() {
			    	$('footer.site-footer').hide();
			    	$('#launcher').hide();
			    });

			    $('#p2p_btn_filter_cancel').click(function() {
			    	$('footer.site-footer').show();
			    	$('#launcher').show();
			    });

			    $('.dashboard #p2p_btn_primary_market_page').click( function() {
			    	$('html, body').stop().animate({
			                'scrollTop': 0
			            }, 800, 'swing', function() {
			        });
			    });

			    $('.p2p-btn-loan-information').click( function() {
			    });

			    $('#p2p_clear_filter_input_btn').click( function() {
					$('#p2p_save_new_filters_btn').show();
					$('#p2p_save_filters_form_cont').hide();
				});
			});
		}
	}

    setTimeout( function() {
    	$(".checkbox_cont input:checked").each(function(){
		    $(this).parent().addClass('checked');
			});

			$('.nav-tabs li a').click(function() {
				$(".checkbox_cont input:checked").each(function(){
			    $(this).parent().addClass('checked');
				});
			});

    	$('.checkbox_cont input').click(function() {
			if($(this).is(":checked")) {
				$(this).parent().addClass('checked');
			}else {
				$(this).parent().removeClass('checked');
			}
		});

		$('#p2p_save_new_filters_btn').click( function() {
			$('#p2p_clear_filter_input_btn').removeClass('disabled');
			$('#p2p_save_filter_name').focus();
		});
    }, 1000);

    // cookie functions
	function createCookie(name,value,days) {
	    var expires = "";
	    if (days) {
	        var date = new Date();
	        date.setTime(date.getTime() + (days*24*60*60*1000));
	        expires = "; expires=" + date.toUTCString();
	    }
	    document.cookie = name + "=" + value + expires + "; path=/";
	}

	function readCookie(name) {
	    var nameEQ = name + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0;i < ca.length;i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1,c.length);
	        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	    }
	    return null;
	}

	function eraseCookie(name) {
	    createCookie(name,"",-1);
	}

	var cookie = readCookie('cookie-alert');
	if (!cookie) {
	    setTimeout(function () {
	      $('.cookie_alert_box').fadeIn(200);
	      $('#launcher').addClass('bottom_cookie');
	    }, 2000)
	    $('.cookie_btn').click(function() {
		  $('#launcher').addClass('bottom');
	      $('.cookie_alert_box').fadeOut(200);
	      //sessionStorage.setItem('cookie-alert','true');
	      createCookie('cookie-alert', 1, 1);
	      $('#launcher').removeClass('bottom_cookie');
	    });
	} else {
		setTimeout(function () {
			$('#launcher').addClass('bottom');
		}, 2000)
	    $('.cookie_alert_box').fadeOut(200);
	}

   if ($('body').hasClass('page-template-page-faq-child') || $('body').hasClass('page-template-page-faq')) {
      var loadTarget = window.location.hash.substr(1);
	    if(loadTarget != '') {
	        e.preventDefault();
	        var $loadTarget = $('#' + loadTarget);
	        $('html, body').stop().animate({
	                'scrollTop': $loadTarget.offset().top - 100
	            }, 700, 'swing', function() {
	        });
	        var accordionindex = $('#' + loadTarget).closest("H2").index();
	        $('.accordion').accordion("option", "active", accordionindex/2);
	    }
	}
});

jQuery(document).ready(function($) {
	$('#gdprcheckboxall, #gdprcheckboxall_comp').click (function () {
		var checkedStatus = this.checked;
		$('.audit_checkboxes').find('.checkbox_cont:first :checkbox').each(function () {
			$(this).prop('checked', checkedStatus);
			if (checkedStatus === true) {
				$(this).parent().addClass('checked');
			}else{
				$(this).parent().removeClass('checked');
			}
		});
	});
});
$(document).ready(function() {
	// Tabs
	$('.pay_method_list .funds_round_btn, .currency_list .currency_select_btn').on('click', function(e) {
		var currentAttrValue = $(this).attr('href');
		$('.information_wrapper').fadeIn(400)
		// Change/remove current tab to active
		$(this).parent('li').addClass('active').siblings().removeClass('active');

		if (document.withdrawDataObj !== undefined && document.withdrawDataObj[$(this).attr('data-currency')].banks.length === 0) {
			$('.page_cont #cannot_withdraw .currency_code_placeholder').text($(this).attr('data-currency'));
			$('.page_cont #cannot_withdraw').fadeIn(400).siblings().hide();
			return;
		}

		// Show/Hide Tabs
		$('.page_cont ' + currentAttrValue).fadeIn(400).siblings().hide();

		e.preventDefault();
		if ($('#card_transfer_next_step .currency_list li').hasClass('active')) {
			$('#card_transfer_next_step .progressbar li:first-child').addClass('done').next().addClass('active');
		}
	});

	// Continue button
	$('.continue_link_btn').on('click', function(e) {
		$(window).scrollTop(0);
		var $this = $(this);
		var currentAttrValue = $this.attr('href');

		$('.page_step' + currentAttrValue).fadeIn(400).addClass('current-step');

		if (typeof(localStorage.pay_method) == 'undefined') {
			localStorage.pay_method = currentAttrValue;
			localStorage.pay_type = $this.parent().data('tab');
		}

		$this.closest('.step_container').hide().removeClass('current-step');

		e.preventDefault();
	});

	$('#site-navigation .add-funds').click(function() {
		localStorage.removeItem('pay_method');
	});

	$('.continue_form_btn').on('click', function(e) {
		$('.steps_back').addClass('back-step');
		$(this).closest('.step_container').addClass('prev-step');
		if ($('#card_transfer_next_step .currency_list li').hasClass('active')) {
			$('#card_transfer_next_step .progressbar li:nth-child(2)').addClass('done').next().addClass('active');
		}
	});
	// Back button
	$('.steps_back').on('click', function(e) {
      $('body').removeClass('fix_body');
		if ($(this).hasClass('back-step')) {
			$('.final_step').removeClass('current-step').hide().prev('.prev-step').fadeIn(400);
			$('#card_transfer_next_step .progressbar li:nth-child(2)').removeClass('done').next().removeClass('active');
			$(this).removeClass('back-step');
		}else{
			$(this).closest('.page_step').hide();
			$('.hide_content').hide();
			$('.step_container').fadeIn(400);
			$('.pay_method_list li, .currency_list li').removeClass('active');
			$('#card_transfer_next_step .progressbar li').removeClass('done');
			$('#card_transfer_next_step .progressbar li:not(:first-child)').removeClass('active');
			$('.information_wrapper').fadeOut(400)
		}
	});

	$('.max_amount_label').on('click', function() {
		var maxAmountValue = $('.currency_list .active .amount span ').text();
		$this = $(this).prev('input');
		$this.val(maxAmountValue);
		var className = 'disabled';
	   	var $childrenFormBtn = $this.closest('form').find('.continue_form_btn');
		if ($this.val() > 0) {
	        $this.removeClass('error');
	        $childrenFormBtn.removeClass(className);
	    } else {
	        $this.addClass('error');
	        $childrenFormBtn.addClass(className);
	    }
	});

	var removeFirstZeroIfAny = function(val) {
	   	if (val.length > 0 && val[0] === '0') {
	   		val = removeFirstZeroIfAny(val.substr(1));
	   	}
	   	return val;
	}
	var validateNumber = function() {
	   var $this = $(this);
	   var className = 'disabled';
	   var $childrenFormBtn = $this.closest('form').find('.continue_form_btn');

		if ($this.val() > 0) {
			$this.removeClass('error');
			$childrenFormBtn.removeClass(className);
			$this.closest('.amount_wrap').next('.msg_wrap').children('.primary_msg').show();
			$this.closest('.amount_wrap').next('.msg_wrap').children('.secondary_msg').hide();
		} else if ($this.val() == 0) {
			$this.addClass('error');
			$childrenFormBtn.addClass(className);
			$this.closest('.amount_wrap').next('.msg_wrap').children('.primary_msg').hide();
			$this.closest('.amount_wrap').next('.msg_wrap').children('.secondary_msg').show();
		} else {
			$this.addClass('error');
			$childrenFormBtn.addClass(className);
		}

	    var inputVal = $this.val();
	    $this.val(removeFirstZeroIfAny(inputVal));
	}

   // $('.amount_wrap input').on('input', validateNumber);

   var nationalIdinput = function() {
      var $this = $(this);
      var className = 'disabled';

      var bday = $('#national_id_popup #popup_birthDay');
      var natid = $('#national_id_popup #popup_national_id');

      var childrenFormBtn = $this.closest('form').find('.blue_round_btn');
      if (bday.is(':visible') && natid.is(':visible')) {
         if (bday.val().trim().length > 0 && natid.val().trim().length > 0 && !$('#no_national_id').parent().hasClass('checked')) {
            $this.removeClass('error');
            childrenFormBtn.removeClass(className);
         } else {
            $this.addClass('error');
            childrenFormBtn.addClass(className);
         }
         if (bday.val().trim().length > 0 && $('#no_national_id').parent().hasClass('checked')) {
            $this.removeClass('error');
            childrenFormBtn.removeClass(className);
         }
      } else if (bday.is(':visible') && !natid.is(':visible')) {
         if (bday.val().trim().length > 0){
            $this.removeClass('error');
            childrenFormBtn.removeClass(className);
         }
         else {
            $this.addClass('error');
            childrenFormBtn.addClass(className);
         }
      } else if (!bday.is(':visible') && natid.is(':visible')) {
         if (natid.val().trim().length > 0) {
            $this.removeClass('error');
            childrenFormBtn.removeClass(className);
         }
         else {
            $this.addClass('error');
            childrenFormBtn.addClass(className);
         }
      }
   }

   $('#national_id_popup .nat_modal_input').on('input', nationalIdinput);

	$('#national_id_popup .checkbox_wrap').on('click', function() {
		var $this = $(this);
		var className = 'disabled';
		var $input = $(this).find('input');
		var $bdayinput = $('#national_id_popup #popup_birthDay');

		var $childrenFormBtn = $this.closest('form').find('.blue_round_btn');

		if ($input.is(":checked")) {
			$('#national_id_popup #popup_national_id').attr('disabled', 'disabled');
		} else{
			$('#national_id_popup #popup_national_id').removeAttr('disabled');
		}

		if($input.is(":checked") && $bdayinput.val().trim().length > 0) {
			$bdayinput.removeClass('error');
	        $childrenFormBtn.removeClass(className);
	    } else {
	        $bdayinput.addClass('error');
	        $childrenFormBtn.addClass(className);
	    }
   });

	$('#national_id_popup .blue_round_btn').on('click', function() {
		if (!$(this).hasClass('disabled')) {
			$('#national_id_popup').removeClass('active_pop');
			$('body').removeClass('fix_body');
		}
   });

   var $popup_trigger = $('.popup_toggle');

   $popup_trigger.on('click', function () {
      var $popup_location = $(this).attr('href');

      $('.popup_wrap' + $popup_location).addClass('active_pop');
      $('body').addClass('fix_body');
   });

	var $popup_close = $('.popup_wrap .close_btn, .popup_wrap .btn_close');
	$popup_close.on('click', function() {
		$(this).closest('.popup_wrap').removeClass('active_pop');
		$('body').removeClass('fix_body');
    });

	$('.tr_ct_btn').on('click', function(e) {
		if ($('.popup_wrap').is(':visible')) {
			$('body').addClass('fix_body');
		}
	});

	// Fill hidden inputs
	$('.payment_info_steps .continue_link_btn').on('click', function() {
		var payment_type = $(this).closest('.payment_info_steps').data('tab');
		$('input[name="pay_type"]').val(payment_type);
	});
	$('.currency_list .currency_select_btn').on('click', function() {
		var currency_type = $(this).data('currency');
		$('input[name="currency_code"]').val(currency_type);
	});

	$("#popup_birthDay").datepicker({
      autoclose:true,
      disableTouchKeyboard:true
   }).on('changeDate', nationalIdinput);

   $(".datepick_input").datepicker({
      autoclose: true,
      disableTouchKeyboard: true
   })

	// Load page functionality
	window.onload = function() {
		if (window.location.href.indexOf('add-funds/') > -1) {
			p2pDepositPageReady();
		}
		else if (window.location.href.indexOf('withdraw-funds/') > -1){
			p2pWithdrawPageReady();
		}
	}

	// Get user email & ID
	var iuvo_session = JSON.parse(localStorage.getItem('session'));
	if(iuvo_session != null){
		var us_ss_id = iuvo_session.investor_id;
		var us_ss_email = iuvo_session.email;

		$('.acc_pay_id').text(us_ss_id);
		$('#client_ss_mail').text(us_ss_email);
		$('#client_ss_mail').attr('href', 'mailto:'+us_ss_email);
	}
   var currentTitle = "";
	$('.page_cont_gray .edit_btn').on('click', function () {
      var $edit_title = $(this).closest('.title').find('.title_input');
      $edit_title.removeAttr('disabled');

      $(this).addClass('hide');
      $(this).next('.edit_btn_wrap').addClass('show');

      currentTitle = $edit_title.val();
    });

    $('.page_cont_gray .edit_btn_wrap .save_btn').on('click', function() {
		var $edit_title =  $(this).closest('.title').find('.title_input');
		$edit_title.attr('disabled', 'disabled');

		$(this).parent().removeClass('show');
      $(this).parent().prev('.edit_btn').removeClass('hide');
    });
    $('.page_cont_gray .edit_btn_wrap .cancel_btn').on('click', function () {
       var $edit_title = $(this).closest('.title').find('.title_input');
       $edit_title.attr('disabled', 'disabled');

       $(this).parent().removeClass('show');
       $(this).parent().prev('.edit_btn').removeClass('hide');

      $edit_title.val(currentTitle);
    });

    function check_selected_currency(){
	    var selectedCurrency = $('.edit_portfolio_wrap .select_currency option:selected').text();
       var selectedAmount = $('.edit_portfolio_wrap #portfolio_size').val();
       if ($('.risk_radio #custom').is(":checked")) {
          switch(selectedCurrency){
             case "BGN":
                var currency_val = $('#balance #balance_BGN .value').text();
                var currency_min = 10;
                break;
             case "EUR":
                var currency_val = $('#balance #balance_EUR .value').text();
                var currency_min = 10;
                break;
             case "RON":
                var currency_val = $('#balance #balance_RON .value').text();
                var currency_min = 25;
                break;
          }
       } else{
          switch(selectedCurrency){
             case "BGN":
                var currency_val = $('#balance #balance_BGN .value').text();
                var currency_min = 1000;
                break;
             case "EUR":
                var currency_val = $('#balance #balance_EUR .value').text();
                var currency_min = 1000;
                break;
             case "RON":
                var currency_val = $('#balance #balance_RON .value').text();
                var currency_min = 4000;
                break;
          }
       }
	    return {
	    	cur_name: selectedCurrency,
	    	cur_val: currency_val,
	    	cur_min: currency_min,
	    	portfolio_size: selectedAmount
	    };
    }

    $('.edit_portfolio_wrap .select_currency').on('change', function() {
      $(this).removeClass('error');
      $(this).next('.nice_select_input').removeClass('error');
    	check_selected_currency();
       var cur_data = check_selected_currency();
      if (cur_data.cur_val < cur_data.cur_min) {
         $('.edit_portfolio_wrap .left_col .note').addClass('error');
			$('.edit_portfolio_wrap #portfolio_size').attr('placeholder', 'Min ' + cur_data.cur_min + ' ' + cur_data.cur_name);
         $('.edit_portfolio_wrap #portfolio_size').val('');
         $('.edit_portfolio_wrap #portfolio_size').addClass('error');
      } else{
         $('.edit_portfolio_wrap .left_col .note').removeClass('error');
         $('.edit_portfolio_wrap #portfolio_size').attr('placeholder', '');
         $('.edit_portfolio_wrap #portfolio_size').val(cur_data.cur_val);
         $('.edit_portfolio_wrap #portfolio_size').removeClass('error');
      }

      var $activate_portfolio_btn = $(this).closest('.page_cont_gray').find('.main_submit_btn');
      if (!$(this).hasClass('error')) {
	    	if (!$('.edit_portfolio_wrap #portfolio_size').hasClass('error')) {
		    	$activate_portfolio_btn.removeClass('disabled');
	    	} else{
		    	$activate_portfolio_btn.addClass('disabled');
	    	}
      } else{
	    	$activate_portfolio_btn.addClass('disabled');
      }

      $('#activate_portfolio_popup .amount_note .min_invest_amount').text(cur_data.cur_name + ' ' +cur_data.cur_min);
    });

    $('.edit_portfolio_wrap #portfolio_size').on('input', validateNumber);

    $('.edit_portfolio_wrap #portfolio_size').on('input', function() {
		 check_selected_currency();
		 var cur_data = check_selected_currency();
		 if ($(this).val() < cur_data.cur_min) {
    		$(this).addClass('error');
    		$('.edit_portfolio_wrap .left_col .note').addClass('error');
      } else {
    		$(this).removeClass('error');
	    	$('.edit_portfolio_wrap .left_col .note').removeClass('error');
      }
      var $activate_portfolio_btn = $(this).closest('.page_cont_gray').find('.main_submit_btn');
      if (!$(this).hasClass('error')) {
      if (!$('.edit_portfolio_wrap .left_col .nice_select_input').hasClass('error')) {
         $activate_portfolio_btn.removeClass('disabled');
      } else{
         $activate_portfolio_btn.addClass('disabled');
      }
      } else{
      $activate_portfolio_btn.addClass('disabled');
      }
    });
    $('.edit_portfolio_wrap .main_submit_btn').on('click', function() {
    	event.preventDefault();

		check_selected_currency();
       var cur_data = check_selected_currency();
       var p_size = parseFloat(cur_data.portfolio_size);
       var min_val = parseFloat(cur_data.cur_min);
       var cur_amount = parseFloat(cur_data.cur_val);

       var popup_wrap = $('#activate_portfolio_popup');

       if (p_size >= min_val && p_size <= cur_amount) {
          // $(this).closest('form').submit();
         popup_wrap.find('.not_enough').hide();
         popup_wrap.find('.agree_terms').show();

         $('body').addClass('fix_body');
         popup_wrap.addClass('active_pop');
    	} else{
    		popup_wrap.find('.not_enough').show();
         popup_wrap.find('.agree_terms').hide();

    		$('body').addClass('fix_body');
    		popup_wrap.addClass('active_pop');
    	}
    });

   $('.page-template-page-auto-invest-portfolio #terms_agree').on('change', function() {
    	var modal_btn = $(this).closest('.checkbox_wrap').next('.activate_portfolio');
    	if ($(this).is(':checked')) {
    		modal_btn.removeClass('disabled');
    	} else{
    		modal_btn.addClass('disabled');
    	}
    });
   $('.leave_feedback_form input[name="radio_group"]').on('change', function () {
      var form_btn = $('.leave_feedback_form .blue_round_btn');

      form_btn.removeClass('disabled');

      var input_toggle = $('.leave_feedback_form .other_toggle');
      var input_msg = input_toggle.parent().next();
      if (input_toggle.is(':checked')) {
         input_msg.show();
         form_btn.addClass('disabled');
      } else{
         input_msg.hide();
         input_msg.val('');
         form_btn.removeClass('disabled');
      }
   });
   $('.leave_feedback_form #other_txt').on('input', function () {
      if ($(this).val().length > 0) {
         $(this).next('.blue_round_btn').removeClass('disabled');
      }else{
         $(this).next('.blue_round_btn').addClass('disabled');
      }
   });

    var trans_error_id = window.location.hash.split("=")[1];
    $('#trans_error_id').text(trans_error_id);

    $("#portfolio_size").blur(function () {
       var val_size = $(this).val();
       if (val_size.split('.').length == 1) {
          $("#portfolio_size").val(val_size + '.00');
       }
    });
    $('#portfolio_size').on('input', validateNumber);

    $('.edit_portfolio_wrap .radio_container .risk_radio').on('click', function () {
       check_selected_currency();
       var cur_data = check_selected_currency();
       if ($(this).hasClass('custom_option')) {
         $('.edit_portfolio_wrap .left_col .amount_note .reg_note').css('display', 'none').next().css('display', 'block');
         // $('#activate_portfolio_popup .reg_note').css('display', 'none').next().css('display', 'block');
      } else{
         $('.edit_portfolio_wrap .left_col .amount_note .reg_note').css('display', 'block').next().css('display', 'none');
         // $('#activate_portfolio_popup .reg_note').css('display', 'block').next().css('display', 'none');
      }
      $('#activate_portfolio_popup .amount_note .min_invest_amount').text(cur_data.cur_name + ' ' + cur_data.cur_min)
    });
   if ($('#new_features_popup').hasClass('active_pop')) {
      $('body').addClass('fix_body');
   }

   // Move chat icon up when is scrolled to the bottom
   if ($('body').hasClass('tb-logged-in')) {
      var footerHeight = $('.tb-logged-in .site-footer').outerHeight();
   } else{
      var footerHeight = $('.site-footer .bottom-bar').outerHeight();
   }
   $(document).on('scroll', function () {
      var distanceFromBottom = $(document).height() - ($(document).scrollTop() + $(window).height());
      if (distanceFromBottom < (footerHeight/3)) {
         $("#launcher").addClass('at_bottom');
         $("#launcher").css('bottom', footerHeight);
         $(".super_easy_toggle").css('bottom', footerHeight + 70);
      } else {
         $("#launcher").removeClass('at_bottom');
			$("#launcher").css('bottom', '0');
         $(".super_easy_toggle").css('bottom', '70px');
      }
   });
});
function validate(evt) {
	var theEvent = evt || window.event;

	// Handle paste
	if (theEvent.type === 'paste') {
		key = event.clipboardData.getData('text/plain');
	} else {
		// Handle key press
		var key = theEvent.keyCode || theEvent.which;
		key = String.fromCharCode(key);
	}
	var regex = /[0-9]|\./;
	if (!regex.test(key)) {
		theEvent.returnValue = false;
		if (theEvent.preventDefault) theEvent.preventDefault();
	}
}


/*  jQuery Nice Select - v1.0
    https://github.com/hernansartorio/jquery-nice-select
    Made by Hernán Sartorio  */
!function(e){e.fn.niceSelect=function(t){function s(t){t.after(e("<div></div>").addClass("nice-select").addClass(t.attr("class")||"").addClass(t.attr("disabled")?"disabled":"").attr("tabindex",t.attr("disabled")?null:"0").html('<span class="current"></span><ul class="list"></ul>'));var s=t.next(),n=t.find("option"),i=t.find("option:selected");s.find(".current").html(i.data("display")||i.text()),n.each(function(t){var n=e(this),i=n.data("display");s.find("ul").append(e("<li></li>").attr("data-value",n.val()).attr("data-display",i||null).addClass("option"+(n.is(":selected")?" selected":"")+(n.is(":disabled")?" disabled":"")).html(n.text()))})}if("string"==typeof t)return"update"==t?this.each(function(){var t=e(this),n=e(this).next(".nice-select"),i=n.hasClass("open");n.length&&(n.remove(),s(t),i&&t.next().trigger("click"))}):"destroy"==t?(this.each(function(){var t=e(this),s=e(this).next(".nice-select");s.length&&(s.remove(),t.css("display",""))}),0==e(".nice-select").length&&e(document).off(".nice_select")):console.log('Method "'+t+'" does not exist.'),this;this.hide(),this.each(function(){var t=e(this);t.next().hasClass("nice-select")||s(t)}),e(document).off(".nice_select"),e(document).on("click.nice_select",".nice-select",function(t){var s=e(this);e(".nice-select").not(s).removeClass("open"),s.toggleClass("open"),s.hasClass("open")?(s.find(".option"),s.find(".focus").removeClass("focus"),s.find(".selected").addClass("focus")):s.focus()}),e(document).on("click.nice_select",function(t){0===e(t.target).closest(".nice-select").length&&e(".nice-select").removeClass("open").find(".option")}),e(document).on("click.nice_select",".nice-select .option:not(.disabled)",function(t){var s=e(this),n=s.closest(".nice-select");n.find(".selected").removeClass("selected"),s.addClass("selected");var i=s.data("display")||s.text();n.find(".current").text(i),n.prev("select").val(s.data("value")).trigger("change")}),e(document).on("keydown.nice_select",".nice-select",function(t){var s=e(this),n=e(s.find(".focus")||s.find(".list .option.selected"));if(32==t.keyCode||13==t.keyCode)return s.hasClass("open")?n.trigger("click"):s.trigger("click"),!1;if(40==t.keyCode){if(s.hasClass("open")){var i=n.nextAll(".option:not(.disabled)").first();i.length>0&&(s.find(".focus").removeClass("focus"),i.addClass("focus"))}else s.trigger("click");return!1}if(38==t.keyCode){if(s.hasClass("open")){var l=n.prevAll(".option:not(.disabled)").first();l.length>0&&(s.find(".focus").removeClass("focus"),l.addClass("focus"))}else s.trigger("click");return!1}if(27==t.keyCode)s.hasClass("open")&&s.trigger("click");else if(9==t.keyCode&&s.hasClass("open"))return!1});var n=document.createElement("a").style;return n.cssText="pointer-events:auto","auto"!==n.pointerEvents&&e("html").addClass("no-csspointerevents"),this}}(jQuery);


(function(e){"use strict";e.fn.pin=function(t){var n=0,r=[],i=false,s=e(window);t=t||{};var o=function(){for(var n=0,o=r.length;n<o;n++){var u=r[n];if(t.minWidth&&s.width()<=t.minWidth){if(u.parent().is(".pin-wrapper")){u.unwrap()}u.css({width:"",left:"",top:"",position:""});if(t.activeClass){u.removeClass(t.activeClass)}i=true;continue}else{i=false}var a=t.containerSelector?u.closest(t.containerSelector):e(document.body);var f=u.offset();var l=a.offset();var c=u.offsetParent().offset();if(!u.parent().is(".pin-wrapper")){u.wrap("<div class='pin-wrapper'>")}var h=e.extend({top:0,bottom:0},t.padding||{});u.data("pin",{pad:h,from:(t.containerSelector?l.top:f.top)-h.top,to:l.top+a.height()-u.outerHeight()-h.bottom,end:l.top+a.height(),parentTop:c.top});u.css({width:u.outerWidth()});u.parent().css("height",u.outerHeight())}};var u=function(){if(i){return}n=s.scrollTop();var o=[];for(var u=0,a=r.length;u<a;u++){var f=e(r[u]),l=f.data("pin");if(!l){continue}o.push(f);var c=l.from-l.pad.bottom,h=l.to-l.pad.top;if(c+f.outerHeight()>l.end){f.css("position","");continue}if(c<n&&h>n){!(f.css("position")=="fixed")&&f.css({left:f.offset().left,top:l.pad.top}).css("position","fixed");if(t.activeClass){f.addClass(t.activeClass)}}else if(n>=h){f.css({left:"",top:h-l.parentTop+l.pad.top}).css("position","absolute");if(t.activeClass){f.addClass(t.activeClass)}}else{f.css({position:"",top:"",left:""});if(t.activeClass){f.removeClass(t.activeClass)}}}r=o};var a=function(){o();u()};this.each(function(){var t=e(this),n=e(this).data("pin")||{};if(n&&n.update){return}r.push(t);e("img",this).one("load",o);n.update=a;e(this).data("pin",n)});s.scroll(u);s.resize(function(){o()});o();s.load(a);return this}})(jQuery)

$(document).ready(function() {
  $('.nice_select_input').niceSelect();

   var $window = $(window);
	$('.or_list .table_wrap .tbody .trow').each(function () {
		if ($window.width() >= 992 && !$(this).hasClass('inactive')) {
			$(this).on('click', function () {
				window.location = $(this).find(".go_to_offer").attr("href");
				return false;
			});
		}
	});


   // Blog pages
   $(".single-post .related-posts .post_section_container").pin({
      containerSelector: ".blog-wrapper",
      minWidth: 992,
      padding: {
         top: 120,
      }
   })

   function sticktothetop() {
		if ($('#stick-here').length) {
			$window = $(window);
			var fromTop = $('#stick-here').offset().top;
			var headerH = $('.iuvo-navbar').outerHeight();

			var realDistance = fromTop - headerH;
			var window_top = $(window).scrollTop();
			var stick_el = $('.blog-wrapper .tabs_wrap');
			if ($window.width() > 991) {
				if (window_top > realDistance) {
					stick_el.addClass('is_stuck');
					stick_el.css('top', headerH);
					// $('#stick-here').height(stick_el.outerHeight());
				} else {
					stick_el.removeClass('is_stuck');
					stick_el.css('top', '100%');
					// $('#stick-here').height(0);
				}
			}
		}
   }
   $(function () {
      $(window).scroll(sticktothetop);
      sticktothetop();
   });

   // Blog toggles
   var $tags_open = false;
   var $search_open = false;

   $('.search_toggle').click(function () {
      if ($search_open) {
         $search_open = false;
         $('.col_toggle_ct .search_form').slideUp();
         $('.col_toggle_ct .tags_box').slideUp();
      } else {
         $search_open = true;
         $tags_open = false;
         $('.col_toggle_ct .search_form').slideDown();
         $('.col_toggle_ct .tags_box').slideUp();
      }
   });
   $('.tags_btn').click(function () {
      if ($tags_open) {
         $tags_open = false;
         $('.col_toggle_ct .tags_box').slideUp();
         $('.col_toggle_ct .search_form').slideUp();
      } else {
         $tags_open = true;
         $search_open = false;
         $('.col_toggle_ct .tags_box').slideDown();
         $('.col_toggle_ct .search_form').slideUp();
      }
   });

   // Open tabs
   var $tabs_open = false;
   $('.tabs_wrap .tabs_holder').click(function () {
      if ($tabs_open) {
         $(this).removeClass('active');
         $tabs_open = false;
      } else{
         $tabs_open = true;
         $(this).addClass('active');
      }
   });

   $(document).bind("mouseup touchend", function (e) {
      var headerSubLink = $('.search_form, .tags_box, .search_toggle, .tags_btn');
      var to_hide = $('.search_form, .tags_box');
      if (!headerSubLink.is(e.target) && headerSubLink.has(e.target).length === 0) {
         to_hide.slideUp();
         $tags_open = false;
         $search_open = false;
      }
      var tabsHide = $('.tabs_wrap .tabs_holder');
      if (!tabsHide.is(e.target) && tabsHide.has(e.target).length === 0) {
         tabsHide.removeClass('active');
         $tabs_open = false;
      }
   });

   var $cur_tab_txt = $('.blog-tabs .tabs_wrap .tabs_holder li.ui-state-active').text();
   var $tab_txt_placeholder = $('.blog-tabs .tabs_wrap .tabs_holder .tabs_holder_txt .placeholder');
   if ($cur_tab_txt.length < 1) {
      // console.log('FAL:KFJ:SALKFJ:SLK');
   } else{
      // console.log('LKHJDKLSHLDKJSH');
      $tab_txt_placeholder.text($cur_tab_txt);
   }

   // Active link in blog
   var $blog_menu_link = $('.menu-item-3089, .menu-item-3087, .menu-item-3093, .menu-item-3093, .menu-item-3088, .menu-item-3090, .menu-item-3092, .menu-item-3094');
   if ($('body').hasClass('archive') || $('body').hasClass('search') || $('body').hasClass('single-post')){
      $blog_menu_link.addClass('current-menu-item');
   }

		var post_id = localStorage.getItem('post_id');
		if (post_id && !$('body').hasClass('single')) {
			localStorage.removeItem('post_id');
			if ($('#post-'+post_id).length > 0) {
				$('html, body').animate({
					scrollTop: $('#post-'+post_id).offset().top - 120
				}, 0);
			}else {
				if((window.innerWidth >= 320) && (window.innerWidth < 768)) {
					setTimeout(function(){
						$('html, body').animate({
							scrollTop: $('#more_posts').offset().top - 90
						}, 0);
					}, 200);
				}else {
					$('html, body').animate({
						scrollTop: $('#more_posts').offset().top - 150
					}, 0);
				}
			}
		}
});
$(document).on('on_p2p_bank_accounts_select_ready', function() {
	$('.bank_acc_select').niceSelect();
});

$(document).trigger('tbp2p_lang_link_repair');

// Back to top button
// function createBackToTop() {
//    $('.page-template-page-all-posts footer, .category footer, .archive footer, .single-post footer, .search footer').append('<div class="back_to_top fa fa-angle-up"></div>');
// }
// createBackToTop();

var offset = 300,
   offset_opacity = 1200,
   scroll_top_duration = 700,
   $back_to_top = $('.back_to_top');

$(window).scroll(function () {
   ($(this).scrollTop() > offset) ? $back_to_top.addClass('visible'): $back_to_top.removeClass('visible fade_out');
   if ($(this).scrollTop() > offset_opacity) {
      $back_to_top.addClass('fade_out');
   }
});

$back_to_top.on('click', function (event) {
   event.preventDefault();
   $('body,html').animate({
      scrollTop: 0,
   }, scroll_top_duration);
});

	function globalCreateCookie(name,value,days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days*24*60*60*1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	function globalreadCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	// SuperEasy Popup button URL
	function superEasyPopUp() {
		var cookieContent = globalreadCookie('super_easy_popup_new');
		var cookiePopupSrc = globalreadCookie('super_easy_popup_new_src');
		var superEasyToggle = $('a[href="#super_easy_popup"]');
		var banner_src = $('#super_easy_popup').attr('data-banner-src');

		if (cookieContent && banner_src == cookiePopupSrc) {
			if (cookieContent == 'minimize') {
				globalCreateCookie('super_easy_popup_new', 'minimize', 30);
				cookieContent = globalreadCookie('super_easy_popup_new');
				superEasyToggle.show();
			} else if (cookieContent == 'dont_show') {
				globalCreateCookie('super_easy_popup_new', 'dont_show', 30);
				cookieContent = globalreadCookie('super_easy_popup_new');
				superEasyToggle.hide();
			} else {
				globalCreateCookie('super_easy_popup_new', 'popup_seen', 30);
				cookieContent = globalreadCookie('super_easy_popup_new');
				$('#super_easy_popup').addClass('active_pop');
				$('body').addClass('fix_body');
			}
		} else {
			globalCreateCookie('super_easy_popup_new', 'popup_seen', 30);
			globalCreateCookie('super_easy_popup_new_src', banner_src, 30);
			$('body').addClass('fix_body');
			$('#super_easy_popup').addClass('active_pop');
		}

		var sPageURL = window.location.href,
			sURLVariables = sPageURL.split(';'),
			cleanURL = sURLVariables[0] + ';' + sURLVariables[1],
			dataValue = $('#super_easy_popup .js-filter').data('target');
			finalURL = cleanURL + dataValue;
			console.log(finalURL);

		$(".super_easy_toggle").on('click', function () {
			$(this).hide();
		});
		$('#super_easy_popup .close_btn').on('click', function () {
			globalCreateCookie('super_easy_popup_new', 'minimize', 30);
			superEasyToggle.show();
		});
		$('#super_easy_popup .js-filter').on('click', function () {
			window.location = finalURL;
			$(this).closest('.popup_wrap').removeClass('active_pop');
			$('body').removeClass('fix_body');
			// globalCreateCookie('super_easy_popup_new', 'dont_show', 30);
			globalCreateCookie('super_easy_popup_new', 'minimize', 30);
			// superEasyToggle.hide();
			superEasyToggle.show();
		});
	}

	// SuperEasy Popup for iuvoUp page
	function superEasyPopUpIuvoup() {
		var cookieContent = globalreadCookie('super_easy_popup_iuvoup');
		var superEasyToggle = $('a[href="#super_easy_popup_iuvoup"]');

		if (cookieContent) {
			if (cookieContent == 'minimize') {
				globalCreateCookie('super_easy_popup_iuvoup', 'minimize', 30);
				cookieContent = globalreadCookie('super_easy_popup_iuvoup');
				superEasyToggle.show();
			} else if (cookieContent == 'dont_show') {
				globalCreateCookie('super_easy_popup_iuvoup', 'dont_show', 30);
				cookieContent = globalreadCookie('super_easy_popup_iuvoup');
				superEasyToggle.hide();
			} else {
				globalCreateCookie('super_easy_popup_iuvoup', 'popup_seen', 30);
				cookieContent = globalreadCookie('super_easy_popup_iuvoup');
				$('#super_easy_popup_iuvoup').addClass('active_pop');
				$('body').addClass('fix_body');
			}
		} else {
			globalCreateCookie('super_easy_popup_iuvoup', 'popup_seen', 30);
			$('body').addClass('fix_body');
			$('#super_easy_popup_iuvoup').addClass('active_pop');
		}


		var sPageURL = window.location.href,
			sURLVariables = sPageURL.split(';'),
			cleanURL = sURLVariables[0] + ';' + sURLVariables[1],
			dataValue = $('#super_easy_popup_iuvoup .js-filter').data('target');
			finalURL = cleanURL + dataValue;
			console.log(finalURL);

		$(".super_easy_toggle").on('click', function () {
			$(this).hide();
		});
		$('#super_easy_popup_iuvoup .close_btn').on('click', function () {
			globalCreateCookie('super_easy_popup_iuvoup', 'minimize', 30);
			superEasyToggle.show();
		});
		$('#super_easy_popup_iuvoup .js-filter').on('click', function () {
			window.location = finalURL;
			$(this).closest('.popup_wrap').removeClass('active_pop');
			$('body').removeClass('fix_body');
			// globalCreateCookie('super_easy_popup_iuvoup', 'dont_show', 30);
			globalCreateCookie('super_easy_popup_iuvoup', 'minimize', 30);
			// superEasyToggle.hide();
			superEasyToggle.show();
		});
	};

	$(document).ready(function () {
		if ($('#super_easy_popup').length) {
			superEasyPopUp();
		}

		if ($('#super_easy_popup_iuvoup').length) {
			superEasyPopUpIuvoup();
		}

		// Currency exchange
		$('.custom_select').on('click', function () {
			var $this = $(this);
			$this.toggleClass('active');

			$(document).bind("mouseup touchend", function (e) {
				var headerSubLink = $this;
				if (!headerSubLink.is(e.target) && headerSubLink.has(e.target).length === 0) {
					headerSubLink.removeClass('active');
				}
			});
		});
		$('.custom_select .dropdown .list_item').on('click', function () {
			var $this = $(this);
			var $selected = $this.closest('.custom_select').find('.selected');

			// Clicked element
			var $currency = $this.data('currency-name');
			var $flag = $this.find('img').attr('src');
			var $name = $this.find('.currency_name').text();
			var $av_funds = $this.find('.funds').text();

			// Update selected
			$selected.find('img').attr('src', $flag);
			$selected.find('.currency_name').text($name);
			$selected.find('.funds').text($av_funds);
			$selected.find('.currency_code').text($currency);
			$selected.closest('.col').find('.amount_wrap').find('.currency_code').text($currency);

			if ($this.closest('.exchange_from').length>0) {
				$('.summery_row .left_col .flag').find('img').attr('src', $flag);
				$('input[name="selected_exchange_currency"]').attr('value', $currency);
				$('.summery_row .left_col .currency_sign').text($currency);
			} else{
				$('.summery_row .right_col .flag').find('img').attr('src', $flag);
				$('input[name="selected_receive_currency"]').attr('value', $currency);
				$('.summery_row .right_col .currency_sign').text($currency);
			}

		});
		$('.exchange_all').on('click', function () {
			var $this = $(this);
			var $title_wrap = $this.closest('.exchange_from');
			var $all_funds = $title_wrap.find('.selected').find('.funds').text();
			$title_wrap.find('.amount_wrap').find('input').attr('value', $all_funds);
			$('#exchange_from_amount').trigger('change');
		});
		$('#exchange_from_amount').on('change paste keyup', function () {
			var $from_val = $(this).val();
			$('.summery_row .total_currency_from').text($from_val);
			if($from_val <= 0){
				$('.summery_row .total_currency_from').text('0.00');
			}
		});
		$(".validate_form").validate({
			rules: {
				dc_earned_from_other: {
					required: function (element) {
						if ($("#dc_checkbox_other").is(':checked')) {
							var e = document.getElementById("dc_earned_from_other");
						}
						else {
							return false;
						}
					}
				}
			}
		});
		$(".quest_form").validate();

		$('#dc_checkbox_other').on('change', function () {
			var otherInput = $('#dc_earned_from_other');
			if ($(this).is(':checked')) {
				otherInput.removeClass('hide');
			} else {
				otherInput.addClass('hide');
				otherInput.val('');
			}
		});
		$('.validate_form input').on('blur keyup change', function () {
			if ($(".validate_form").valid()) {
				$('button[type="submit"').prop('disabled', false);
			} else {
				$('button[type="submit"').prop('disabled', 'disabled');
			}
		});
		$('.profile-tabs .nav-tabs #btn-nav-head-questionnarie a').on('click', function() {
			$('.tb-jft-form .left-column, .tb-jft-form .right-column').hide();
		});
		$('.profile-tabs .nav-tabs li:not(#btn-nav-head-questionnarie) a').on('click', function () {
			$('.tb-jft-form .left-column, .tb-jft-form .right-column').show();
		});
		$('#radioBtn a').on('click', function () {
			var sel = $(this).data('title');
			var tog = $(this).data('toggle');
			$('#' + tog).prop('value', sel);

			$('a[data-toggle="' + tog + '"]').not('[data-title="' + sel + '"]').removeClass('active').addClass('notActive');
			$('a[data-toggle="' + tog + '"][data-title="' + sel + '"]').removeClass('notActive').addClass('active');

			$(this).closest('.input-group').addClass('valid');
		});

		function progressBar (el){
			var $progress = el.attr('data-pct');
			var val = parseInt($progress);
			var $circle = el.find('.bar');

			var r = $circle.attr('r');
			var c = Math.PI*(r*2);

			if (val < 0) { val = 0;}
			if (val > 100) { val = 100;}

			var pct = ((100-val)/100)*c;

			$circle.css({ strokeDashoffset: pct});

			// $circle.animate({
			// 	strokeDashoffset: pct
			// }, 2000, function() {});
		}

		$('.progressBar').each(function () {
			var el = $(this);
			progressBar(el);
		});

		// Close langs when clicked outside
		$(document).bind("mouseup touchend", function (e) {
			var langNav = $('#lang-menu');
			var langToggle = langNav.find('.dropdown-toggle');
			if (!langNav.is(e.target) && langNav.has(e.target).length === 0) {
				if (langToggle.hasClass('toggled-on')){
					langToggle.click();
				}
			}
		});



		// Reveal
		var dr = new DummyReveal({
			mobile: true,
		});

		$('.learn_more_link').on('click', function() {
			$this = $(this);
			var $target = $this.data('target');

			$this.toggleClass('active');
			$('#'+$target).slideToggle();
			if(!$this.hasClass('active')){
				window.scrollTo({
					top: document.querySelector('#'+$target).getBoundingClientRect().top + window.pageYOffset - 110,
					behavior: "smooth"
			 });
			}
		});


		// Calculate main.site-main tag relative to footer and navigation height - +/x ???
		// let minusHeight = Number($('.site-footer').height()) + Number($('.iuvo-navbar').height());
		let minusHeight = Number($('.site-footer').height()) + Number($('.site-content').css('padding-top').split('px')[0]);
		$('.tb-logged-in main.site-main').css('min-height', 'calc(100vh - ' + minusHeight + 'px)');

		$('.iuvo-dropdown').on('click', function(){
			if(window.innerWidth <= 1200){
				$(this).children('.sub-menu').slideToggle()
			}
		})

		$("video[autoplay]").each(function(){ this.play(); });

		// Get Investor Level
		if (localStorage.getItem('session')) {
			let investor_lvl_id = localStorage.getItem('investor_lvl_id');
			if (investor_lvl_id == 1) { // Lead
				// console.log('1');
				// $('.status_gold').show();
				// $('.status_starter').hide();
				// $('#user-menu li.username').addClass('gold_user');
			}else if(investor_lvl_id == 2) { // Gold
				$('.status_gold').show();
				$('.status_starter').hide();
				$('#user-menu li.username').addClass('gold_user');
			}else if(investor_lvl_id == 4) { // Colleagues
				// console.log('4');
			}else if(investor_lvl_id == 5) { // Silver
				$('.status_silver').show();
				$('.status_starter').hide();
				$('#user-menu li.username').addClass('silver_user');
			}else if(investor_lvl_id == 11) { // Colleagues Silver
				$('.status_silver').show();
				$('.status_starter').hide();
				$('#user-menu li.username').addClass('silver_user');
			}else if(investor_lvl_id == 8) { // Colleagues Gold
				$('.status_gold').show();
				$('.status_starter').hide();
				$('#user-menu li.username').addClass('gold_user');
			}
		}
	});
	$.extend($.validator.messages, {
		required: string_translations.required,
		remote: string_translations.remote,
		email: string_translations.email,
		url: string_translations.url,
		date: string_translations.date,
		dateISO: string_translations.dateISO,
		number: string_translations.number,
		digits: string_translations.digits,
		creditcard: string_translations.creditcard,
		equalTo: string_translations.equalTo,
		extension: string_translations.extension,
		maxlength: $.validator.format(string_translations.maxlength + " {0} " + string_translations.characters + "."),
		minlength: $.validator.format(string_translations.minlength  + " {0} " + string_translations.characters + "."),
		rangelength: $.validator.format(string_translations.rangelength + " {0} " + string_translations.and + " {1} " + string_translations.characters + "."),
		range: $.validator.format(string_translations.range + " {0} " + string_translations.and + " {1}."),
		max: $.validator.format(string_translations.max + " {0}."),
		min: $.validator.format(string_translations.min + " {0}.")
	});

var isMobile = false; //initiate as false
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) ||
   /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      $('body.page-template-page-all-posts, body.category, body.archive, body.single-post, body.search').addClass('is_mobile');
}


(function(){"use strict";var t=function(){var e={},i=!1,s=0,a=arguments.length;"[object Boolean]"===Object.prototype.toString.call(arguments[0])&&(i=arguments[0],s++);for(var n=function(s){for(var a in s)Object.prototype.hasOwnProperty.call(s,a)&&(i&&"[object Object]"===Object.prototype.toString.call(s[a])?e[a]=t(!0,e[a],s[a]):e[a]=s[a])};s<a;s++){n(arguments[s])}return e};function e(t,e){this.element=t,this.offsetTop=t.offsetTop,this.triggered=!1,this.offset=null==t.getAttribute("data-offset")?e.globalOffset:t.getAttribute("data-offset"),this.defaultClass=null==t.getAttribute("data-default-class")?e.classDefault:t.getAttribute("data-default-class"),this.noAnimateClass=null==t.getAttribute("data-no-animate-class")?e.noAnimateClass:t.getAttribute("data-no-animate-class"),this.activeClass=null==t.getAttribute("data-active-class")?e.classActive:t.getAttribute("data-active-class"),this.delay=null==t.getAttribute("data-delay")?e.globalDelay:t.getAttribute("data-delay"),this.reverse=null!=t.getAttribute("data-reverse")||e.reverse,this.duration=null==t.getAttribute("data-duration")?e.duration:t.getAttribute("data-duration"),this.element.classList.add(this.defaultClass),this.element.classList.add(this.noAnimateClass),void 0!==this.duration&&(console.log(this.duration),this.element.style.animationDuration=this.duration+"ms")}return window.mobilecheck=function(){var t,e=!1;return t=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0),e},this.DummyReveal=function(t){this.defaults={selector:"reveal",classDefault:"animated",classActive:"fadeIn",globalDelay:0,globalOffset:0,noAnimateClass:"noAnimate",reverse:!1,mobile:!1,duration:void 0},this.elements=[],this._init(t)},DummyReveal.prototype._init=function(e){this.defaults=t(!0,this.defaults,e),this.defaults.mobile?this._setItems():window.mobilecheck()||this._setItems()},DummyReveal.prototype._setItems=function(){for(var t=document.getElementsByClassName(this.defaults.selector),i=0;i<t.length;i++){var s=new e(t[i],this.defaults);this.elements.push(s)}this._addEventListeners()},DummyReveal.prototype._addEventListeners=function(){var t=this,e=window.innerHeight+window.pageYOffset;t._checkVisible(e),window.addEventListener("scroll",function(){var e=window.innerHeight+window.pageYOffset;t._checkVisible(e)})},DummyReveal.prototype._checkVisible=function(t){for(var e=0;e<this.elements.length;e++){var i=this.elements[e].element.getBoundingClientRect().top+window.pageYOffset;parseInt(i)+parseInt(this.elements[e].offset)<parseInt(t)&&parseInt(i)>parseInt(t-window.innerHeight-this.elements[e].element.offsetHeight)?this.elements[e].hasActive()||this.elements[e].addActiveClass():this.elements[e].hasReverse()&&this.elements[e].removeActiveClass()}},e.prototype.hasActive=function(){return this.element.classList.contains(this.activeClass)},e.prototype.addActiveClass=function(){var t=this;setTimeout(function(){t.element.classList.remove(t.noAnimateClass),t.element.classList.add(t.activeClass)},t.delay)},e.prototype.removeActiveClass=function(){var t=this;setTimeout(function(){t.element.classList.add(t.noAnimateClass),t.element.classList.remove(t.activeClass)},t.delay)},e.prototype.hasReverse=function(){return this.reverse},DummyReveal}).call(this);
