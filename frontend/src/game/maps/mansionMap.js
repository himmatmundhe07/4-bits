export const mansionMap = {
  id: 'classic_mansion',
  width: 48,
  height: 36,
  rooms: [
    {
      id: 'library',
      label: 'Library',
      x: 2, y: 2, w: 14, h: 14,
      floorTile: 3, // FLOOR_WOOD_DARK
      doorways: ['east', 'south'],
      furniture: [
        { tile: 19, tx: 3, ty: 2, collides: true, shadowBelow: true }, // BOOKSHELF_L
        { tile: 20, tx: 4, ty: 2, collides: true, shadowBelow: true }, // BOOKSHELF_R
        { tile: 19, tx: 5, ty: 2, collides: true, shadowBelow: true },
        { tile: 20, tx: 6, ty: 2, collides: true, shadowBelow: true },
        { tile: 21, tx: 10, ty: 10, collides: true, shadowBelow: true }, // DESK_L
        { tile: 22, tx: 11, ty: 10, collides: true, shadowBelow: true }, // DESK_R
        { tile: 31, tx: 10, ty: 12, collides: false, shadowBelow: false }, // CHAIR_UP
      ],
      clueMarkers: [
        { id: 'lib_clue_1', label: 'Bookshelf', tx: 4, ty: 3, furnitureName: 'Bookshelf' },
        { id: 'lib_clue_2', label: 'Desk', tx: 10, ty: 10, furnitureName: 'Desk' }
      ],
      spawnMarkers: [
        { id: 'lib_spawn_1', tx: 8, ty: 8 }
      ]
    },
    {
      id: 'bedroom',
      label: 'Bedroom',
      x: 32, y: 2, w: 14, h: 14,
      floorTile: 4, // FLOOR_CARPET_RED
      doorways: ['west', 'south'],
      furniture: [
        { tile: 23, tx: 34, ty: 4, collides: true, shadowBelow: false }, // BED_HEAD
        { tile: 24, tx: 34, ty: 5, collides: true, shadowBelow: true }, // BED_FOOT
        { tile: 35, tx: 42, ty: 3, collides: true, shadowBelow: true }, // WARDROBE
        { tile: 26, tx: 43, ty: 12, collides: true, shadowBelow: true }, // SAFE
      ],
      clueMarkers: [
        { id: 'bed_clue_1', label: 'Bed', tx: 34, ty: 5, furnitureName: 'Bed' },
        { id: 'bed_clue_2', label: 'Safe', tx: 43, ty: 12, furnitureName: 'Safe' }
      ],
      spawnMarkers: [
        { id: 'bed_spawn_1', tx: 38, ty: 8 }
      ]
    },
    {
      id: 'foyer',
      label: 'Foyer',
      x: 16, y: 2, w: 16, h: 20,
      floorTile: 7, // FLOOR_STONE
      doorways: ['west', 'east', 'south', 'north'], // North represents entrance door (closed)
      furniture: [
        { tile: 33, tx: 23, ty: 10, collides: false, shadowBelow: false }, // RUG_CENTER
        { tile: 33, tx: 24, ty: 10, collides: false, shadowBelow: false },
        { tile: 33, tx: 23, ty: 11, collides: false, shadowBelow: false },
        { tile: 33, tx: 24, ty: 11, collides: false, shadowBelow: false },
        { tile: 27, tx: 18, ty: 3, collides: true, shadowBelow: true }, // CLOCK
      ],
      clueMarkers: [
        { id: 'foyer_clue_1', label: 'Grandfather Clock', tx: 18, ty: 4, furnitureName: 'Clock' },
        { id: 'foyer_clue_2', label: 'Coat Rack', tx: 28, ty: 4, furnitureName: 'Coat Rack' }
      ],
      spawnMarkers: [
        { id: 'foyer_spawn_1', tx: 23, ty: 14 }
      ]
    },
    {
      id: 'kitchen',
      label: 'Kitchen',
      x: 2, y: 16, w: 14, h: 10,
      floorTile: 6, // FLOOR_TILE_BATH
      doorways: ['east', 'south'],
      furniture: [
        { tile: 25, tx: 4, ty: 17, collides: true, shadowBelow: true }, // SINK
        { tile: 30, tx: 8, ty: 20, collides: true, shadowBelow: true }, // TABLE
        { tile: 30, tx: 9, ty: 20, collides: true, shadowBelow: true },
        { tile: 28, tx: 10, ty: 17, collides: true, shadowBelow: true }, // OVEN (reusing fireplace tile)
        { tile: 29, tx: 11, ty: 17, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'kit_clue_1', label: 'Kitchen Sink', tx: 4, ty: 18, furnitureName: 'Sink' },
        { id: 'kit_clue_2', label: 'Oven', tx: 10, ty: 18, furnitureName: 'Oven' }
      ],
      spawnMarkers: [
        { id: 'kit_spawn_1', tx: 8, ty: 22 }
      ]
    },
    {
      id: 'bathroom',
      label: 'Bathroom',
      x: 32, y: 16, w: 14, h: 8,
      floorTile: 6, // FLOOR_TILE_BATH
      doorways: ['west'],
      furniture: [
        { tile: 25, tx: 40, ty: 17, collides: true, shadowBelow: true }, // SINK
      ],
      clueMarkers: [
        { id: 'bath_clue_1', label: 'Bathroom Sink', tx: 40, ty: 18, furnitureName: 'Sink' }
      ],
      spawnMarkers: [
        { id: 'bath_spawn_1', tx: 38, ty: 20 }
      ]
    },
    {
      id: 'dining',
      label: 'Dining Room',
      x: 2, y: 26, w: 22, h: 8,
      floorTile: 1, // FLOOR_WOOD_A
      doorways: ['north', 'east'],
      furniture: [
        { tile: 30, tx: 8, ty: 28, collides: true, shadowBelow: true }, // TABLE
        { tile: 30, tx: 9, ty: 28, collides: true, shadowBelow: true },
        { tile: 30, tx: 10, ty: 28, collides: true, shadowBelow: true },
        { tile: 30, tx: 11, ty: 28, collides: true, shadowBelow: true },
        { tile: 30, tx: 12, ty: 28, collides: true, shadowBelow: true },
        { tile: 32, tx: 9, ty: 27, collides: false, shadowBelow: false }, // CHAIR_DOWN
        { tile: 32, tx: 11, ty: 27, collides: false, shadowBelow: false }, 
        { tile: 31, tx: 9, ty: 29, collides: false, shadowBelow: false }, // CHAIR_UP
        { tile: 31, tx: 11, ty: 29, collides: false, shadowBelow: false }, 
        { tile: 28, tx: 16, ty: 27, collides: true, shadowBelow: true }, // FIREPLACE
        { tile: 29, tx: 17, ty: 27, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'din_clue_1', label: 'Dining Table', tx: 10, ty: 29, furnitureName: 'Table' },
        { id: 'din_clue_2', label: 'Fireplace', tx: 16, ty: 28, furnitureName: 'Fireplace' }
      ],
      spawnMarkers: [
        { id: 'din_spawn_1', tx: 14, ty: 30 }
      ]
    },
    {
      id: 'study',
      label: 'Secret Study',
      x: 30, y: 24, w: 16, h: 10,
      floorTile: 2, // FLOOR_WOOD_B
      doorways: ['north'],
      furniture: [
        { tile: 21, tx: 36, ty: 28, collides: true, shadowBelow: true }, // DESK_L
        { tile: 22, tx: 37, ty: 28, collides: true, shadowBelow: true }, // DESK_R
        { tile: 34, tx: 42, ty: 25, collides: true, shadowBelow: true }, // PLANT
        { tile: 26, tx: 32, ty: 25, collides: true, shadowBelow: true }, // SAFE
      ],
      clueMarkers: [
        { id: 'study_clue_1', label: 'Secret Desk', tx: 36, ty: 28, furnitureName: 'Desk' },
        { id: 'study_clue_2', label: 'Hidden Safe', tx: 32, ty: 26, furnitureName: 'Safe' },
        { id: 'study_clue_3', label: 'Potted Plant', tx: 42, ty: 26, furnitureName: 'Plant' }
      ],
      spawnMarkers: [
        { id: 'study_spawn_1', tx: 38, ty: 30 }
      ]
    },
    // Connecting Hallways
    {
      id: 'hallway_1',
      label: 'Hallway',
      x: 24, y: 22, w: 6, h: 12,
      floorTile: 1,
      doorways: ['west', 'north'],
      furniture: [],
      clueMarkers: [],
      spawnMarkers: [ { id: 'hall1_spawn_1', tx: 26, ty: 28 } ]
    }
  ]
};
