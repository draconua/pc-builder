// =============================================================
// storage.js — localStorage manager for saved PC builds
// =============================================================

const STORAGE_KEY = 'pc-builder-saved';

export function saveBuild(name, buildState) {
  const builds = loadBuilds();
  const entry = {
    name,
    parts: {},
    date: new Date().toISOString(),
  };
  for (const [cat, part] of Object.entries(buildState)) {
    entry.parts[cat] = part ? part.id : null;
  }
  const idx = builds.findIndex(b => b.name === name);
  if (idx >= 0) builds[idx] = entry;
  else builds.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}

export function loadBuilds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteBuild(name) {
  const builds = loadBuilds().filter(b => b.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
}
