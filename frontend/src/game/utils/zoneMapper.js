export function remapMapConfig(mapConfig, mapDef) {
  if (!mapConfig || !mapDef) return mapConfig;
  const newConfig = JSON.parse(JSON.stringify(mapConfig));

  // 1. Gather all available markers from the map definition
  let availableClueMarkers = [];
  let availableSpawnMarkers = [];

  mapDef.rooms.forEach(room => {
    room.clueMarkers.forEach(cm => {
      availableClueMarkers.push({ ...cm, roomLabel: room.label });
    });
    room.spawnMarkers.forEach(sm => {
      availableSpawnMarkers.push({ ...sm, roomLabel: room.label });
    });
  });

  // Shuffle arrays so fallback placement is semi-random
  availableClueMarkers.sort(() => Math.random() - 0.5);
  availableSpawnMarkers.sort(() => Math.random() - 0.5);

  // 2. Remap Clue Placements
  if (newConfig.cluePlacements) {
    newConfig.cluePlacements.forEach(clue => {
      if (availableClueMarkers.length === 0) return; // Out of markers

      // Try to find a marker that matches the AI's requested itemName (e.g. "Desk", "Safe")
      const requestedItem = clue.itemName.toLowerCase();
      let matchIdx = availableClueMarkers.findIndex(cm => 
        cm.furnitureName.toLowerCase().includes(requestedItem) ||
        requestedItem.includes(cm.furnitureName.toLowerCase())
      );

      if (matchIdx === -1) {
        matchIdx = 0; // Fallback to whatever is next
      }

      const marker = availableClueMarkers.splice(matchIdx, 1)[0];
      
      // Update coordinates (convert tile coordinates to pixel coordinates, center of 32x32 tile)
      clue.x = (marker.tx * 32) + 16;
      clue.y = (marker.ty * 32) + 16;
      // Optionally update itemName to match the authored map's reality
      clue.itemName = marker.label;
    });
  }

  // 3. Remap Suspect Spawns
  if (newConfig.suspectSpawns) {
    newConfig.suspectSpawns.forEach((spawn, idx) => {
      if (availableSpawnMarkers.length === 0) return; // Out of markers

      const marker = availableSpawnMarkers[idx % availableSpawnMarkers.length];
      
      spawn.x = (marker.tx * 32) + 16;
      spawn.y = (marker.ty * 32) + 16;
      spawn.roomLabel = marker.roomLabel;
    });
  }

  return newConfig;
}
