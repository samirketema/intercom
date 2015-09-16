var fs = require('fs');

//Generally accepted value for Earth's radius in Kilometers.
var EARTH_RADIUS_IN_KILOMETERS = 6371;
//Distance at which we'll invite customers for drinks :)
var DISTANCE_FOR_DRINKS_IN_KILOMETERS = 100;

function readInput() {
    try {
        //Read in file and split by lines (as denoted in input).
        var input = fs.readFileSync('./customers.txt');
        return input;
    } catch (err) {
        //Throw error for reading file.
        throw err;
    }
}

var lines = readInput().toString().split('\n');

function degreesToRadians(num) {
    return num * (Math.PI / 180);
}

//This is where the Intercom office is located :D
var office = {
    "latitude": degreesToRadians(53.3381985),
    "longitude": degreesToRadians(-6.2592576)
};

//Returns a list of cusomters that are within the 100km range we need.
function findCustomersInRange() {
    var invitedCustomers = [];
    lines.forEach(function(line) {
        //Parse JSON for current Customer.
        var customer = JSON.parse(line);

        //Convert their Lat/Long from Degrees to Radians.
        var customerLat = degreesToRadians(customer.latitude);
        var customerLong = degreesToRadians(customer.longitude);

        //Calculate Delta Longitude (absolute value)
        var deltaLon = Math.abs(customerLong - office.longitude);

        //Calculate central angle
        var centralAngle = Math.acos((Math.sin(office.latitude) * Math.sin(customerLat)) +
            (Math.cos(office.latitude) * Math.cos(customerLat) * Math.cos(deltaLon)));

        //If the customer is in range, invite them for drinks. :)
        if ((centralAngle * EARTH_RADIUS_IN_KILOMETERS) <= DISTANCE_FOR_DRINKS_IN_KILOMETERS) {
            invitedCustomers.push(customer);
        }
    });

    return sortCustomers(invitedCustomers);
}

//Sort the customers according to their user_id.
function sortCustomers(customers) {
    customers.sort(function(a, b) {
        return a.user_id - b.user_id;
    });
    return customers;
}

//Call the function that finds if our customers are in range.
var customers = findCustomersInRange();
customers.forEach(function(c) {
    console.log(c);
});