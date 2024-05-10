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
    // const location = await Geolocation.getCurrentPosition();

    CapacitorNotifications.schedule([
      {
        id: 1,
        title: 'Nearby Cases 💀',
        body: `Searched for Neary Cases at Location 5 at 5 🚨`,
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
