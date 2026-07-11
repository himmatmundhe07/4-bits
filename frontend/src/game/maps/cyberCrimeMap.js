export const cyberCrimeMap = {
  id: 'cyber_crime',
  width: 48,
  height: 36,
  rooms: [
    {
      id: 'server_room',
      label: 'Server Room',
      x: 2, y: 2, w: 14, h: 14,
      floorTile: 7, // FLOOR_STONE (reused as metal/concrete)
      doorways: ['east', 'south'],
      furniture: [
        { tile: 19, tx: 4, ty: 4, collides: true, shadowBelow: true }, // Reusing bookshelf as Server Rack
        { tile: 20, tx: 5, ty: 4, collides: true, shadowBelow: true },
        { tile: 19, tx: 8, ty: 4, collides: true, shadowBelow: true },
        { tile: 20, tx: 9, ty: 4, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'srv_clue_1', label: 'Mainframe Rack', tx: 4, ty: 4, furnitureName: 'Server Rack' }
      ],
      spawnMarkers: [
        { id: 'srv_spawn_1', tx: 8, ty: 8 }
      ]
    },
    {
      id: 'control_center',
      label: 'Control Center',
      x: 16, y: 2, w: 16, h: 20,
      floorTile: 6, // FLOOR_TILE_BATH (reused as linoleum)
      doorways: ['west', 'east', 'south'],
      furniture: [
        { tile: 30, tx: 20, ty: 10, collides: true, shadowBelow: true }, // Desk Island
        { tile: 30, tx: 21, ty: 10, collides: true, shadowBelow: true },
        { tile: 30, tx: 22, ty: 10, collides: true, shadowBelow: true },
        { tile: 30, tx: 23, ty: 10, collides: true, shadowBelow: true },
        { tile: 21, tx: 20, ty: 8, collides: true, shadowBelow: true },
        { tile: 22, tx: 21, ty: 8, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'ctrl_clue_1', label: 'Security Terminal', tx: 20, ty: 8, furnitureName: 'Terminal' }
      ],
      spawnMarkers: [
        { id: 'ctrl_spawn_1', tx: 24, ty: 14 }
      ]
    },
    {
      id: 'breakroom',
      label: 'Breakroom',
      x: 32, y: 2, w: 14, h: 14,
      floorTile: 1, // WOOD
      doorways: ['west', 'south'],
      furniture: [
        { tile: 25, tx: 40, ty: 4, collides: true, shadowBelow: true }, // SINK
      ],
      clueMarkers: [
        { id: 'break_clue_1', label: 'Coffee Machine', tx: 40, ty: 4, furnitureName: 'Coffee Machine' }
      ],
      spawnMarkers: [
        { id: 'break_spawn_1', tx: 38, ty: 8 }
      ]
    },
    {
      id: 'main_office',
      label: 'Main Office',
      x: 2, y: 16, w: 22, h: 18,
      floorTile: 2,
      doorways: ['east', 'north'],
      furniture: [
        { tile: 21, tx: 6, ty: 20, collides: true, shadowBelow: true }, // DESK_L
        { tile: 22, tx: 7, ty: 20, collides: true, shadowBelow: true }, // DESK_R
        { tile: 21, tx: 12, ty: 20, collides: true, shadowBelow: true },
        { tile: 22, tx: 13, ty: 20, collides: true, shadowBelow: true },
      ],
      clueMarkers: [
        { id: 'off_clue_1', label: 'Cubicle A', tx: 6, ty: 20, furnitureName: 'Desk' },
        { id: 'off_clue_2', label: 'Cubicle B', tx: 12, ty: 20, furnitureName: 'Desk' }
      ],
      spawnMarkers: [
        { id: 'off_spawn_1', tx: 10, ty: 24 }
      ]
    },
    {
      id: 'exec_suite',
      label: 'Executive Suite',
      x: 24, y: 22, w: 22, h: 12,
      floorTile: 4, // RED CARPET
      doorways: ['west', 'north'],
      furniture: [
        { tile: 21, tx: 34, ty: 26, collides: true, shadowBelow: true }, // DESK_L
        { tile: 22, tx: 35, ty: 26, collides: true, shadowBelow: true }, // DESK_R
        { tile: 26, tx: 40, ty: 24, collides: true, shadowBelow: true }, // SAFE
        { tile: 34, tx: 32, ty: 24, collides: true, shadowBelow: true }, // PLANT
      ],
      clueMarkers: [
        { id: 'exec_clue_1', label: 'CEO Desk', tx: 34, ty: 26, furnitureName: 'Desk' },
        { id: 'exec_clue_2', label: 'Wall Safe', tx: 40, ty: 24, furnitureName: 'Safe' }
      ],
      spawnMarkers: [
        { id: 'exec_spawn_1', tx: 36, ty: 30 }
      ]
    }
  ]
};
