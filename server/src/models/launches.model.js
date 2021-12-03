const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const launches = new Map();

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['BD', 'NASA'],
  upcoming: true,
  success: true,
};

saveLaunch(launch)

async function saveLaunch(launch) {
  try {
    const planet = await planets.findOne({
      keplerName: launch.target,
    });
    if (!planet) {
      throw new Error('No matching planet found')
    }
    await launchesDatabase.updateOne({
      flightNumber: launch.flightNumber,
    }, launch, {
      upsert: true,
    })
  } catch(err) {
    console.log(`Failed to save Launch: ${err.message}`);
  }
}

function isLaunchExist(launchId) {
  console.log(launches);
  return launches.has(launchId)
}

async function getAllLaunches() {
  try {
    return await launchesDatabase.find({}, {
      '_id': 0,
      '__v': 0,
    });
  } catch(err) {
    console.log(`could not fetch Launches: ${err.message}`);
  }
};

async function getLatestFlightNumber() {
  try {
    const latestLaunch = launchesDatabase.findOne().sort('-flightNumber');

    if(!latestLaunch) {
      return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
  } catch(err) {
    console.log(`Could not get the latest flightNumber: ${err.message}`);
  }
}

async function addNewLaunch(launch) {
  const latestFlightNumber = await getLatestFlightNumber();
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
      customers: ['Bangladesh', 'NASA'],
      upcoming: true,
      success: true,
  });

  await saveLaunch(launch)
};

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.success = false;
  aborted.upcoming = false;
  return aborted;
}

module.exports = {
  isLaunchExist,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
}