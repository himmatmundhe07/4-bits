export const hauntedHouseMap = {
  id: 'haunted_house',
  width: 48,
  height: 36,
  rooms: [
    {
      id: 'foyer',
      label: 'Grand Hall',
      x: 16, y: 2, w: 16, h: 16,
      floorTile: 7, // STONE
      doorways: ['west', 'east', 'south'],
      furniture: [
        { tile: 33, tx: 23, ty: 8, collides: false, shadowBelow: false }, // RUG
        { tile: 33, tx: 24, ty: 8, collides: false, shadowBelow: false },
        { tile: 27, tx: 18, ty: 3, collides: true, shadowBelow: true }, // CLOCK
      ],
      clueMarkers: [
        { id: 'foyer_clue_1', label: 'Cursed Clock', tx: 18, ty: 4, furnitureName: 'Clock' }
      ],
      spawnMarkers: [ { id: 'foyer_spawn_1', tx: 24, ty: 10 } ]
    },
    {
      id: 'crypt',
      label: 'Crypt',
      x: 32, y: 2, w: 14, h: 14,
      floorTile: 3, // DARK WOOD
      doorways: ['west', 'south'],
      furniture: [
        { tile: 23, tx: 36, ty: 6, collides: true, shadowBelow: false }, // Coffin head (reused bed)
        { tile: 24, tx: 36, ty: 7, collides: true, shadowBelow: true },  // Coffin foot
      ],
      clueMarkers: [
        { id: 'crypt_clue_1', label: 'Stone Sarcophagus', tx: 36, ty: 7, furnitureName: 'Sarcophagus' }
      ],
      spawnMarkers: [ { id: 'crypt_spawn_1', tx: 38, ty: 12 } ]
    },
    {
      id: 'chapel',
      label: 'Chapel',
      x: 2, y: 2, w: 14, h: 20,
      floorTile: 4, // RED CARPET
      doorways: ['east', 'south'],
      furniture: [
        { tile: 30, tx: 6, ty: 6, collides: true, shadowBelow: true }, // Altar (reused table)
        { tile: 30, tx: 7, ty: 6, collides: true, shadowBelow: true },
        { tile: 30, tx: 8, ty: 6, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'chap_clue_1', label: 'Profaned Altar', tx: 7, ty: 6, furnitureName: 'Altar' }
      ],
      spawnMarkers: [ { id: 'chap_spawn_1', tx: 8, ty: 14 } ]
    },
    {
      id: 'torture_chamber',
      label: 'Torture Chamber',
      x: 2, y: 22, w: 16, h: 12,
      floorTile: 7, // STONE
      doorways: ['east', 'north'],
      furniture: [
        { tile: 35, tx: 4, ty: 24, collides: true, shadowBelow: true }, // Iron Maiden (reused wardrobe)
      ],
      clueMarkers: [
        { id: 'tort_clue_1', label: 'Iron Maiden', tx: 4, ty: 24, furnitureName: 'Maiden' }
      ],
      spawnMarkers: [ { id: 'tort_spawn_1', tx: 10, ty: 28 } ]
    },
    {
      id: 'library',
      label: 'Occult Library',
      x: 18, y: 18, w: 28, h: 16,
      floorTile: 2, // WOOD_B
      doorways: ['north', 'west'],
      furniture: [
        { tile: 19, tx: 22, ty: 20, collides: true, shadowBelow: true },
        { tile: 20, tx: 23, ty: 20, collides: true, shadowBelow: true },
        { tile: 19, tx: 24, ty: 20, collides: true, shadowBelow: true },
        { tile: 20, tx: 25, ty: 20, collides: true, shadowBelow: true },
        { tile: 28, tx: 34, ty: 20, collides: true, shadowBelow: true }, // FIREPLACE
        { tile: 29, tx: 35, ty: 20, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'lib_clue_1', label: 'Forbidden Tome', tx: 23, ty: 21, furnitureName: 'Bookshelf' },
        { id: 'lib_clue_2', label: 'Ashen Hearth', tx: 34, ty: 20, furnitureName: 'Fireplace' }
      ],
      spawnMarkers: [ { id: 'lib_spawn_1', tx: 30, ty: 26 } ]
    }
  ]
};
