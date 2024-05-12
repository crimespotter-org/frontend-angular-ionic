addEventListener('myCustomEvent', (resolve, reject, args) => {
  console.log('do something to update the system here');
  resolve();
});

addEventListener('notificationTest', async (resolve, reject, args) => {
  try {
    let scheduleDate = new Date();
    scheduleDate.setSeconds(scheduleDate.getSeconds() + 5);
    CapacitorNotifications.schedule([
      {
        id: 42,
        title: 'Background Magic 🧙‍♂️',
        body: 'This comes from the background runner',
        scheduleAt: scheduleDate,
      },
    ]);
    resolve();
  } catch (err) {
    console.error(err);
    reject(err);
  }
});

addEventListener('checkForNearyCases', async (resolve, reject, args) => {
  try {
    const location = await CapacitorGeolocation.getCurrentPosition();

    console.log(location)

    CapacitorNotifications.schedule([
      {
        id: 1,
        title: 'Nearby Cases 💀',
        body: `Searched for Neary Cases at Location ${location?.longitude}, ${location?.latitude} 🚨`,
        scheduleAt: new Date(),
      },
    ]);
    resolve();
  } catch (err) {
    console.error(err);
    console.log("Error occured");
    reject(err);
  }
});
