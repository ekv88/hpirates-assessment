// Some pixi magic
var MainApp = new function() {
	var hotelLoad = false,
		reviewLoad = false,
		hotelLoadCount = 5;
	
	this.init = function() {
		$(document).on("click", ".main-load-btn", function() {
			MainApp.loadHotels();
		});
		$(document).on("click", ".show-more-btn", function() {
			var hotel_id = $(this).parents(".hotel-article").data("id");
			if($(this).data("status") != "show") {
				$('.hotel-article[data-id="' + hotel_id + '"').find(".hotel-reviews").fadeOut(300);
				$(this).val("Show reviews");
				$(this).data("status", "show");
				return false;
			}
			MainApp.loadReview(hotel_id);
			$(this).val("Hide reviews");
		});
	}
	
	this.loadHotels = function() {
		$.ajax({
			type: 'GET',
			url: 'http://fake-hotel-api.herokuapp.com/api/hotels',
			data: 'count=' + hotelLoadCount,
			cache: false,
			dataType: 'json',
			headers: { },
			crossDomain: true,
			success: function (data, textStatus, xhr) {
				if(hotelLoad === false) {
					hotelLoad = true;
					MainApp.renderHotels(data);
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				var data = JSON.parse(xhr.responseText);
				MainApp.renderMessage("error", data.error);
			}
		});
	}
	
	this.renderMessage = function(msg_class, msg_text) {
		var html = "<div class='message " + msg_class +"'>" + msg_text + "</div>";
		alert("Error!");
		return html;
	}
	
	this.convertDate = function(timestamp) {
		var date = new Date(timestamp);

		var day = date.getDate(),
			month = date.getMonth() + 1,
			year = date.getFullYear();

		return  day + "." + month + "." + year;
	}
	
	this.renderHotels = function(data) {
        $.each(data, function (i) {
            if (typeof data[i].id !== "undefined") {
                var html = '\n\
				<div class="hotel-article" data-id="' + data[i].id + '">\n\
					<div class="image" style="background-image: url(\'' + data[i].images[0] + '\')"></div>\n\
					<div class="rating">' + MainApp.rednerStars(data[i].stars) + '</div>\n\
					<h3 class="title">' + data[i].name + '</h3>\n\
					<span class="location">' + data[i].country + ', ' + data[i].city + '</span>\n\
					<p class="dsc">' + data[i].description + '</p>\n\
					<input type="button" class="btn show-more-btn" value="Show reviews" data-status="show">\n\
					<span class="time">' + MainApp.convertDate(data[i].date_start) + ' - ' + MainApp.convertDate(data[i].date_end) + '</span>\n\
					<div class="hotel-reviews"></div>\n\
				</div>';
                $('.main-holder').append(html);
				$('.main-holder > .hotel-article:last').fadeIn(300);
            }
        });
		
		hotelLoad = false;
	}
	
	this.rednerStars = function(stars_numb) {
		var html = "";
		var empty_stars = 5 - stars_numb;
		for (fs = 0; fs < stars_numb; fs++) { 
			html += '<span class="star full">&#9733;</span>';
		}
		for (es = 0; es < empty_stars; es++) { 
			html += '<span class="star">&#9733;</span>';
		}
		
		return html;
	}
	
	this.loadReview = function(hotel_id) {
		$.ajax({
			type: 'GET',
			url: 'http://fake-hotel-api.herokuapp.com/api/reviews',
			data: 'hotel_id=' + hotel_id,
			cache: false,
			dataType: 'json',
			headers: { },
			crossDomain: true,
			success: function (data, textStatus, xhr) {
				if(reviewLoad === false) {
					reviewLoad = true;
					MainApp.renderReview(data, hotel_id);
				}
			},
			error: function (xhr, textStatus, errorThrown) {
				var data = JSON.parse(xhr.responseText);
				MainApp.renderMessage("error", data.error);
			}
		});
	}
	
	this.renderReview = function(data, hotel_id) {
		/** R.I.P job offer part of code **/
		var article_element = $('.hotel-article[data-id="' + hotel_id + '"').find(".hotel-reviews");
		
		article_element.html("");
		
		if(Object.keys(data).length === 0) {
			article_element.html("<div class='message info'>Nop, no comments this time...</div>");
			article_element.fadeIn(300);
			reviewLoad = false;
			return false;
		}
		$.each(data, function (i) {
            if (typeof data[i].hotel_id !== "undefined") {
				var rating = "positive",
					rating_string = "+";
				if(data[i].positive !== true) {
					rating = "negative";
					rating_string = "-";
				}
                var html = '\n\
					<div class="review">\n\
						<span class="rating ' + rating + '">' + rating_string + '</span>\n\
						<span class="name">' + data[i].name + '</span>\n\
						<p class="text">' + data[i].comment + '</p>\n\
					</div>';
                article_element.append(html);
            }
        });
		$('.hotel-article[data-id="' + hotel_id + '"').find(".show-more-btn").data("status", "hide");
		article_element.fadeIn(300);
		reviewLoad = false;
	}
};


// Page load
$(document).ready(function () {
    MainApp.init();
});
