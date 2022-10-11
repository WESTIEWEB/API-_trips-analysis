const { getDriver, getTrips, getVehicle } = require('api');


async function getAllDrivers(trips) {
  // const trips = await getTrips();
  const driverIDs = trips.map(trip => trip.driverID);
  // console.log(trips)
  const uniqueDriverIDs = [...new Set(driverIDs)];
//   console.log(uniqueDriverIDs)
  const allDrivers = await Promise.all(uniqueDriverIDs.map(async id => 
    {
       try {const result = await getDriver(id); 
        if(result){
          // console.log(result)
          return result}} catch(err) {}
  }
    ) );

  // try {
  //   for (id of uniqueDriverIDs) {
  //     const result = await getDriver(id);
  //     result.id = id;
  //     allDrivers.push(result);
  //   }
  // } catch (error) {}

  return allDrivers.filter(item => item);
}
async function getDriverWithMultipleVehicles(drivers) {

  // console.log(drivers)
  // const drivers = await getAllDrivers(trips);
  let noOfdrivers = 0;
  for (let driver of drivers) {
    if (driver.vehicleID.length > 1) {
      noOfdrivers++;
    }
  }
  return noOfdrivers;
}

async function getMostTrips(trips) {
  // const trips = await getTrips();
  let drivers = {};
  for (let [index, trip] of trips.entries()) {
    
    trip.tripTotal = Number(trip.billedAmount.toString().replace(/,/, ''));
    const tripTotal = trip.tripTotal;
    let driverId = trip.driverID;

    if (!drivers[driverId]) {
      drivers[driverId] = { driverId, trips: 1, tripTotal };
    } else {
      drivers[driverId].trips++;
      drivers[driverId].tripTotal += tripTotal;
    }
  }
  return drivers
}

// driver report demand
async function getTripsByDriver(id, trips) {
  // const trips = await getTrips();
  let tripsByDriver = [];

  for (const [index, trip] of trips.entries()) {
    if (trip.driverID == id) {
      trip.tripTotal = Number(trip.billedAmount.toString().replace(/,/, ''));
      const { tripTotal, user, pickup, destination, created, isCash } = trip;
      const tripp = {
        user: user.name,
        created,
        pickup: pickup.address,
        destination: destination.address,
        billed: tripTotal,
        isCash
      };
      tripsByDriver.push(tripp);
    }
  }
  return tripsByDriver
}

async function getVehicleDetails(vehicles) {
  const result = [];
  for (const id of vehicles) {
    const details = await getVehicle(id);
    let { plate, manufacturer } = details;
    result.push({ plate, manufacturer });
  }
  return result
}



module.exports = {
  getAllDrivers,
  getDriverWithMultipleVehicles,
  getMostTrips,
  getTripsByDriver,
  getVehicleDetails
};
