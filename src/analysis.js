// const {getTrips, getDriver, getVehicle } = require('api');
const { getTrips, getDriver } = require('./node_modules/api/index');
// const drivers = require('../data/drivers.json');
// const vehicles = require('../data/vehicles.json');

const { 
  getAllDrivers,
  getDriverWithMultipleVehicles,
  getMostTrips,
  getTripsByDriver,
  getVehicleDetails,
} = require("./remote_api");






/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */

async function analysis() {
  // Your code goes here
  
  const trips = await getTrips();

  const allDrivers = await getAllDrivers(trips)

  // console.log(allDrivers)

  const cashTrips = trips.filter(trip => trip.isCash === true);
  const cashBilledTotal = cashTrips.reduce((total, trip) => {
    trip.tripTotal = Number(trip.billedAmount.toString().replace(/,/, ''));
    return total + trip.tripTotal;
  }, 0);
  const nonCashTrips = trips.filter(trip => trip.isCash === false);
  const nonCashBilledTotal = nonCashTrips.reduce((total, trip) => {
    trip.tripTotal = Number(trip.billedAmount.toString().replace(/,/, ''));
    totalCash = total + trip.tripTotal;
    return Number(totalCash.toFixed(2));
  }, 0);
  const noOfDriversWithMoreThanOneVehicle = await getDriverWithMultipleVehicles(allDrivers);
  const groups = await getMostTrips(trips);

  const sortedByTrips = Object.values(groups).sort((a, b) => b.trips - a.trips);
  const driverWithMostTrips = sortedByTrips[0].driverId;
  let noOfTrips = sortedByTrips[0].trips;
  let totalAmountEarned = sortedByTrips[0].tripTotal;
  let driverDetails = await getDriver(driverWithMostTrips);
  let { name, email, phone } = driverDetails;

  let mostTripsByDriver = { name, email, phone, noOfTrips, totalAmountEarned };

  const sortedByBills = Object.values(groups).sort((a, b) => b.tripTotal - a.tripTotal);
  const driverWithHighestBill = sortedByBills[0].driverId;
  noOfTrips = sortedByBills[0].trips;
  totalAmountEarned = sortedByBills[0].tripTotal;
  driverDetails = await getDriver(driverWithHighestBill);
  driverDetails = { name, email, phone } = driverDetails;

  const highestEarningDriver = { name, email, phone, noOfTrips, totalAmountEarned };

  const result = {
    noOfCashTrips: cashTrips.length,
    noOfNonCashTrips: nonCashTrips.length,
    billedTotal: cashBilledTotal + nonCashBilledTotal,
    cashBilledTotal,
    nonCashBilledTotal,
    noOfDriversWithMoreThanOneVehicle,
    mostTripsByDriver,
    highestEarningDriver
  };

  return result;
  // console.log(result)

  
}
analysis().then(data => console.log(data))


module.exports = analysis;
