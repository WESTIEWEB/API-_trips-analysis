const { 
      getAllDrivers,
      getDriverWithMultipleVehicles,
      getMostTrips,
      getTripsByDriver,
      getVehicleDetails,
    } = require("./remote_api");

const {getTrips} = require("api")
/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */

  
async function driverReport() {

  let result = [];
 const trips = await getTrips()
  const drivers = await getAllDrivers(trips);
  const mostTrips = await getMostTrips(trips);

  for (let driver of drivers) {
    // console.log(driver)
    const { name, id, phone, vehicleID } = driver;
    // console.log(name)
    const vehicles = await getVehicleDetails(vehicleID);
    const trips = await getTripsByDriver(id, trips);
    const cashTrips = trips.filter(trip => trip.isCash);
    const nonCashTrips = trips.filter(trip => !trip.isCash);
    const totalCashAmount = cashTrips.reduce((total, amount) => total + amount.billed, 0);
    const totalNonCashAmount = nonCashTrips.reduce((total, amount) => total + amount.billed, 0);

    resultObject = {
      fullname: name,
      id,
      phone,
      noOfTrips: mostTrips[id].trips,
      noOfVehicles: vehicleID.length,
      vehicles,
      noOfCashTrips: cashTrips.length,
      noOfNonCashTrips: nonCashTrips.length,
      totalAmountEarned: totalCashAmount + totalNonCashAmount,
      totalCashAmount,
      totalNonCashAmount,
      trips
    };
    result.push(resultObject);
  }
  return result;
  // console.log(result)

}
// driverReport().then(data => console.log(data))
module.exports = driverReport;
