var clndrEvents = [];
input.events.forEach(function(currEvent) {
    //transform event to digestable format for clndr.js
    var temp = {};
    temp.occasion = currEvent.occasion;
    temp.invited_count = currEvent.invited_count;

    //Store as moment() for clndr
    temp.date = moment(currEvent.year.toString() + "-" +
        currEvent.month.toString() + "-" +
        currEvent.day.toString(), "YYYY-MM-DD"
    );
    if (currEvent.hasOwnProperty("cancelled")) {
        temp.cancelled = currEvent.cancelled;
    }
    clndrEvents.push(temp);
});

function populateEventModal(eventListing) {
    eventListing.forEach(function(currEvent) {
        //handle if the event is cancelled.
        if (currEvent.hasOwnProperty("cancelled") && currEvent.cancelled === true) {
            $("#eventText").append("<br/><p>CANCELLED:<br/><strike><u>" +
                currEvent.occasion + "</u><br/>" + currEvent.invited_count + " people invited <br/>" +
                currEvent.date.format(
                    "dddd, MMMM Do YYYY") + "</strike></p>");
        } else {
            var isoDate = currEvent.date.format("YYYYMMDD[T]SSSSSS[Z]");
            var link = "https://www.google.com/calendar/render?action=TEMPLATE&text=" + currEvent.occasion.split(
                ' ').join('+') + "&dates=" + isoDate + "/" + isoDate + "&location=Intercom+HQ";

            $("#eventText").append("<br/><p><u>" + currEvent.occasion + "</u><br/>" + currEvent.date.format(
                    "dddd, MMMM Do YYYY") + "<br/>" +
                currEvent.invited_count + " people invited" + "<br/><a href=\"" + link +
                "\" + target=\"_blank\">Google Calendar</a></p>");
        }
    });
}

function mapFormatDate(str) {
    str = str.split('-').join('');
    str = str.split('.').join('');
    return str.split(':').join('');
}

$('#listButton').on('click', function(e) {
    $("#eventListTitle").empty();
    $("#eventText").empty();
    $("#eventListTitle").append("All Listed Events");
    populateEventModal(clndrEvents);
    $("#eventModal").modal().toggle();

});

$("#calendar").clndr({
    events: clndrEvents,
    clickEvents: {
        click: function(target) {
            eventView = [];
            $("#eventListTitle").empty();
            $("#eventText").empty();
            $("#eventListTitle").append("Events on " + target.date.format("dddd, MMMM Do YYYY"));
            if (target.events.length <= 0)
                $("#eventText").append("<span> No events! Make some plans! ;)</span>");
            else {
                populateEventModal(target.events);
            }
            $("#eventModal").modal().toggle();
        }
    }
});