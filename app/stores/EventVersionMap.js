const eventVersionMap = new Map();


function updateVersion(id) {
  eventVersionMap.set(id, getEventVersion(id) + 1);
}

function getEventVersion(id) {
  return eventVersionMap.get(id) || 0;
}


export { updateVersion, getEventVersion };
