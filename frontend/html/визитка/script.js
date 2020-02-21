//initialize
let closed = true;
// let closed_faq_beton = true;
// faq_mobile_beton();
// let closed_faq_pesko = true;
// faq_mobile_pesko();
// let closed_instruction = true;
// instruction();


$(document).ready(function () {
    var headerHeight = $('nav').outerHeight();
    $('.slide-selection').click(function (e) {
        var linkHref = window.location.hash;
        if (linkHref == '#contactform-desktop' && $(window).width() < 765) {
            linkHref = '#contact'
        }
        $('html, body').animate({
            scrollTop: $(linkHref).offset().top - headerHeight
        }, 1000)
        return null;
    });
})

$(document).ready(function () {

    var contactForm = $('#skeptic');
    var contactTop = contactForm.offset().top;
    $(window).bind('scroll', function () {
        var windowTop = $(window).scrollTop() + $(window).height();
        if (windowTop > contactTop) {
            $('#map-container-google-11').html('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2442.7583378838117!2d104.18938121579731!3d52.24777297976353!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x51736c9d9fd236a7!2z0JHQtdGC0L7QvdC90LDRjyDRhNCw0LHRgNC40LrQsCDQktGL0LzQv9C10Ls!5e0!3m2!1sru!2sru!4v1556920725593!5m2!1sru!2sru"\n' +
                'frameborder="0" style="border:0" allowfullscreen></iframe>' +
                '<script src="https://www.gstatic.com/firebasejs/5.4.2/firebase.js" async></script>');
            $(window).unbind('scroll');
        }
    });

    var index = window.location.pathname.indexOf('/', 2);
    var str = window.location.pathname;
    if (index != -1) {
        str = window.location.pathname.substr(index + 1);
    }

    var headerHeight = $('nav').outerHeight();

    if (window.location.hash == '#goods') {
        $('html, body').animate({
            scrollTop: $(window.location.hash).offset().top - headerHeight
        }, 0);
        return null;
    }


    if (str == 'help.html') {
        var hashes = ['#spheres', '#marks', '#difference', '#marks-pesko', '#volume', '#prepare', '#filling'];
        hashes.forEach(function (element) {
            if (window.location.hash == element) {
                $(element).collapse('show');
                $('html, body').animate({
                    scrollTop: $(element).offset().top - headerHeight
                }, 0);
                return null;
            }
        });
    }

    // if (window.location.hash != '') {
    //     $('html, body').animate({
    //         scrollTop: $(window.location.hash).offset().top - headerHeight
    //     }, 0);
    //
    //     return null;
    // }


});

function faq_href(href) {
    document.location.href = href;
}


var config = {
    apiKey: "AIzaSyBTXraJdczxIC_m4wykLIceVj0honhPyRk",
    authDomain: "vimpel38-f63da.firebaseapp.com",
    databaseURL: "https://vimpel38-f63da.firebaseio.com",
    projectId: "vimpel38-f63da",
    storageBucket: "vimpel38-f63da.appspot.com",
    messagingSenderId: "87790285772"
};


document.getElementById('contactform').addEventListener('submit', submitForm);


// Submit form
function submitForm(e) {
    e.preventDefault();

    // Get values
    var name = getInputVal('name');
    var email = getInputVal('email');
    var message = getInputVal('message');

    //name, message, email
    saveMessage(name, email, message);

    //alert
    document.querySelector('.alert').style.display = 'block';

    //Hide 10s
    setTimeout(function () {
        document.querySelector('.alert').style.display = 'none';
    }, 10000);

    //reset
    document.getElementById('contactform').reset();
}

//values
function getInputVal(id) {
    return document.getElementById(id).value;
}

//from ref
function saveMessage(name, email, message) {
    firebase.initializeApp(config);

//reference
    var messagesRef = firebase.database().ref("Messages");
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: name,
        email: email,
        message: message
    });

}

$(window).scroll(function () {

    if ($(window).scrollTop() < 200) {
        $('.strip').removeClass('fixed-bottom');
    } else {
        $('.strip').addClass('fixed-bottom');
        $('.strip').addClass('container');
    }
    if ($(window).width() < 768) {
        $('.strip').removeClass('fixed-bottom');
        $('.strip').removeClass('container');
        $('.strip').addClass('container-fluid');
    }

    if ($(window).width() < 768) {
        $('.fix').removeClass('left');
        $('.fix').addClass('centered');
    }

    if ($(window).width() > 768) {
        $('.fix').addClass('left');
        $('.fix').removeClass('centered');
    }

});


