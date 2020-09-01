//$(".messages").animate({ scrollTop: $(document).height() }, "slow");
$(".messages").animate({scrollTop: $(document).height() + $(window).height() }, "slow");

$("#profile-img").click(function() {
	$("#status-options").toggleClass("active");
});

$(".expand-button").click(function() {
  $("#profile").toggleClass("expanded");
	$("#contacts").toggleClass("expanded");
});

//$("#status-options ul li").click(function() {
//	$("#profile-img").removeClass();
//	$("#status-online").removeClass("active");
//	$("#status-away").removeClass("active");
//	$("#status-busy").removeClass("active");
//	$("#status-offline").removeClass("active");
//	$(this).addClass("active");
//
//	if($("#status-online").hasClass("active")) {
//		$("#profile-img").addClass("online");
//	} else if ($("#status-away").hasClass("active")) {
//		$("#profile-img").addClass("away");
//	} else if ($("#status-busy").hasClass("active")) {
//		$("#profile-img").addClass("busy");
//	} else if ($("#status-offline").hasClass("active")) {
//		$("#profile-img").addClass("offline");
//	} else {
//		$("#profile-img").removeClass();
//	};
//
//	$("#status-options").removeClass("active");
//});

function newMessage() {
	var input = $(".message-input input");
	message = $(input).val();
	if($.trim(message) == '') {
		return false;
	}
	$('<li class="replies"><img src="https://img.icons8.com/dusk/64/000000/change-user-male.png" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
	$('.message-input input').val(null);
	$('.contact.active .preview').html('<span>You: </span>' + message);
	$(".messages").animate({ scrollTop: $(document).height() + $(window).height()}, "slow");
	$(window).scrollTop();
	$(input).focus();
//	newReply(message);
    var msg = {"message": message.toLowerCase()}
    $.ajax({
        url: '/getResponse/',
        type: 'POST',
        data: msg,
        success: function(response){
            newReply(response.data);
        },
        error: function(response){
            alert("App Crashed")
        }

    });
};

function newReply(message) {
//	var input = $(".message-input input");
//	message = $(input).val();
//	if($.trim(message) == '') {
//		return false;
//	}
	$('<li class="sent"><img src="https://thumbs-prod.si-cdn.com/mGzVOiub9nq8OQFc0Q_q90D1JWw=/fit-in/1600x0/https://public-media.si-cdn.com/filer/79/4a/794a7e74-8c99-4fde-abcd-a303bc302ba1/sars-cov-19.jpg" alt="" /><p>' + message + '</p></li>').appendTo($('.messages ul'));
	$('.message-input input').val(null);
	$('.contact.active .preview').html('<span>You: </span>' + message);
	$(".messages").animate({ scrollTop: $(document).height() + $(window).height()}, "slow");
	$(window).scrollTop();
	$(input).focus();
};

$('.submit').click(function() {
  newMessage();
});

$(window).on('keydown', function(e) {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});
//# sourceURL=pen.js