// Create local storage for the last batch per project,
// with key-value format: PROJECT_<projectId>:<batchId>
// PROJECT6026c27f985b1417b005d36f: 6026c27f985b1417b005d36d

export function getBatchKey(project) {
  return `PROJECT_${project._id}`;
}

export function setLocalStorage(project) {
  const key = getBatchKey(project);
  const found = window.localStorage.getItem(key);
  let verified = false;

  project.batches.forEach(b => {
    if (b._id == found) {
      verified = true;
      return; // stop iteration
    }
  });

  if (verified) {
    return found;
  } else {
    // Check if the project has at least one batch
    if (project.batches.length > 0) {
      const batchId = project.batches[0]["_id"];
      window.localStorage.setItem(key, batchId);
      return batchId;
    }
  }

  // For missing batch...
  window.localStorage.setItem(key, null);
  return null;
}

export function getLastVisitedBatchId(project) {
  if (window === undefined) return false;
  const key = getBatchKey(project);
  return window.localStorage.getItem(key);
}

export function getLastVisitedBatch(project) {
  const batchId = getLastVisitedBatchId(project);
  let lastBatch = null;

  project.batches.forEach(batch => {
    if (batch._id == batchId) {
      lastBatch = batch;
      return;
    }
  })

  return lastBatch;
}