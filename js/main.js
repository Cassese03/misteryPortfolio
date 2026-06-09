(function ($) {
    "use strict";

    // Helper per ottenere la posizione esatta dello scroll su diversi browser (essendo html il contenitore)
    var getScrollTop = function () {
        return $(window).scrollTop() || $('html').scrollTop() || 0;
    };

    // Modifica stile Navbar al passaggio dello scroll
    $(window).add('html').on('scroll', function () {
        if (getScrollTop() > 50) {
            $('.navbar').addClass('navbar-scrolled');
        } else {
            $('.navbar').removeClass('navbar-scrolled');
        }
    });

    // Rilevazione scroll per nascondere/mostrare pulsanti bottom/top
    $(window).add('html').on('scroll', function () {
        if (getScrollTop() > 100) {
            $('.scroll-to-bottom').stop(true, true).fadeOut('slow');
        } else {
            $('.scroll-to-bottom').stop(true, true).fadeIn('slow');
        }

        if (getScrollTop() > 200) {
            $('.back-to-top').stop(true, true).fadeIn('slow');
        } else {
            $('.back-to-top').stop(true, true).fadeOut('slow');
        }
    });

    // Funzione helper per scorrimento fluido sicuro, bypassando scroll-snap e scroll-behavior nativo
    function smoothScrollTo(targetTop, duration, callback) {
        var htmlEl = $('html')[0];
        
        // Ripristina prima le proprietà nel caso in cui un'animazione precedente sia stata interrotta
        htmlEl.style.removeProperty('scroll-snap-type');
        htmlEl.style.removeProperty('scroll-behavior');
        
        // Ferma le animazioni correnti di scorrimento su html e body
        $('html, body').stop(true, false);
        
        // Disabilita temporaneamente scroll-snap e scroll-behavior nativo con !important
        htmlEl.style.setProperty('scroll-snap-type', 'none', 'important');
        htmlEl.style.setProperty('scroll-behavior', 'auto', 'important');
        
        $('html, body').animate({
            scrollTop: targetTop
        }, duration, 'easeInOutExpo').promise().done(function () {
            // Ripristina scroll-snap e scroll-behavior nativo
            htmlEl.style.removeProperty('scroll-snap-type');
            htmlEl.style.removeProperty('scroll-behavior');
            if (callback) callback();
        });
    }

    // Pulsante "Torna in alto" (Back to top)
    $('.back-to-top').click(function () {
        smoothScrollTo(0, 1500);
        return false;
    });

    // Smooth scrolling sui link della navbar e altri collegamenti interni
    $(".navbar-nav a, .btn-outline-primary, a[href^='#']").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            
            // Definiamo la lista ordinata delle sezioni principali per calcolare matematicamente l'offset
            var sections = ["#home", "#about", "#skill", "#qualification", "#certifications", "#service", "#portfolio", "#contact", "footer"];
            var index = sections.indexOf(hash);
            var targetOffset;
            
            if (index !== -1) {
                // Ogni sezione ha esattamente altezza 100vh, quindi l'offset statico è un multiplo dell'altezza di una sezione
                var sectionHeight = $("#home").outerHeight() || $(window).height();
                targetOffset = index * sectionHeight;
            } else {
                // Fallback nel caso in cui il link punti a un elemento interno generico
                var $target = $(hash);
                if ($target.length) {
                    targetOffset = $target.offset().top;
                } else {
                    return;
                }
            }
            
            // Rileva se stiamo usando il posizionamento sticky (attivo su tutte le sezioni nel nostro CSS)
            var isSticky = $(hash).css('position') === 'sticky' || $(hash).css('position') === '-webkit-sticky';
            
            // Se le sezioni sono sticky, scendiamo all'offset esatto (il padding-top del CSS gestirà lo spazio della navbar).
            // Altrimenti, sottraiamo l'altezza della navbar per evitare sovrapposizioni.
            var scrollTopTarget = isSticky ? targetOffset : (targetOffset - 80);
            
            smoothScrollTo(scrollTopTarget, 1500);
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
                
                // Chiude automaticamente il menu collassabile in mobile
                if ($('.navbar-collapse').hasClass('show')) {
                    $('.navbar-collapse').collapse('hide');
                }
            }
        }
    });

    // Typed Text Init (Carosello parole animate nell'Hero)
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 80,
            backSpeed: 30,
            smartBackspace: false,
            loop: true
        });
    }

    // Animazione delle barre di competenza (Skills)
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '90%'});

    // Portfolio isotope and filter
    var portfolioContainer = $('.portfolio-container');
    if (portfolioContainer.length) {
        var portfolioIsotope = portfolioContainer.isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
        $('#portfolio-flters li').on('click', function () {
            $("#portfolio-flters li").removeClass('active');
            $(this).addClass('active');
            portfolioIsotope.isotope({filter: $(this).data('filter')});
        });
    }

    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        });

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        });
    });

})(jQuery);
