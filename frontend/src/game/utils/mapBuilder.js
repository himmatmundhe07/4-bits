export function buildTilemapJSON(mapDef) {
  const w = mapDef.width || 48;
  const h = mapDef.height || 36;
  const size = w * h;

  const floorData = new Array(size).fill(1); // Default wood floor everywhere
  const wallsData = new Array(size).fill(0);
  const furnData = new Array(size).fill(0);
  const decoData = new Array(size).fill(0);
  
  const objects = [];
  let nextObjId = 1;

  // 1. Draw outer boundary
  for (let x = 0; x < w; x++) {
    wallsData[x] = 16; // TRIM
    wallsData[(h - 1) * w + x] = 16;
  }
  for (let y = 0; y < h; y++) {
    wallsData[y * w] = 16;
    wallsData[y * w + w - 1] = 16;
  }

  // 2. Build rooms
  mapDef.rooms.forEach(room => {
    const rx = room.x;
    const ry = room.y;
    const rw = room.w;
    const rh = room.h;

    // Floor
    for (let y = ry; y < ry + rh; y++) {
      for (let x = rx; x < rx + rw; x++) {
        floorData[y * w + x] = room.floorTile || 1;
      }
    }

    // Walls
    for (let x = rx; x < rx + rw; x++) {
      wallsData[ry * w + x] = 8; // Top wall
      wallsData[(ry + rh - 1) * w + x] = 8; // Bottom wall
    }
    for (let y = ry; y < ry + rh; y++) {
      wallsData[y * w + rx] = 9; // Left wall
      wallsData[y * w + rx + rw - 1] = 9; // Right wall
    }

    // Corners
    wallsData[ry * w + rx] = 10; // NW
    wallsData[ry * w + rx + rw - 1] = 11; // NE
    wallsData[(ry + rh - 1) * w + rx] = 12; // SW
    wallsData[(ry + rh - 1) * w + rx + rw - 1] = 13; // SE

    // Doorways (punch 2-tile wide gaps, brute forcing through overlapping walls)
    if (room.doorways.includes('north') && ry > 1) {
      const dx = rx + Math.floor(rw / 2);
      wallsData[ry * w + dx] = 0; wallsData[ry * w + dx - 1] = 0;
      wallsData[(ry - 1) * w + dx] = 0; wallsData[(ry - 1) * w + dx - 1] = 0;
      wallsData[(ry - 2) * w + dx] = 0; wallsData[(ry - 2) * w + dx - 1] = 0;
    }
    if (room.doorways.includes('south') && ry + rh < h - 1) {
      const dx = rx + Math.floor(rw / 2);
      wallsData[(ry + rh - 1) * w + dx] = 0; wallsData[(ry + rh - 1) * w + dx - 1] = 0;
      wallsData[(ry + rh) * w + dx] = 0; wallsData[(ry + rh) * w + dx - 1] = 0;
      wallsData[(ry + rh + 1) * w + dx] = 0; wallsData[(ry + rh + 1) * w + dx - 1] = 0;
    }
    if (room.doorways.includes('west') && rx > 1) {
      const dy = ry + Math.floor(rh / 2);
      wallsData[dy * w + rx] = 0; wallsData[(dy - 1) * w + rx] = 0;
      wallsData[dy * w + rx - 1] = 0; wallsData[(dy - 1) * w + rx - 1] = 0;
      wallsData[dy * w + rx - 2] = 0; wallsData[(dy - 1) * w + rx - 2] = 0;
    }
    if (room.doorways.includes('east') && rx + rw < w - 1) {
      const dy = ry + Math.floor(rh / 2);
      wallsData[dy * w + rx + rw - 1] = 0; wallsData[(dy - 1) * w + rx + rw - 1] = 0;
      wallsData[dy * w + rx + rw] = 0; wallsData[(dy - 1) * w + rx + rw] = 0;
      wallsData[dy * w + rx + rw + 1] = 0; wallsData[(dy - 1) * w + rx + rw + 1] = 0;
    }

    // Furniture
    room.furniture.forEach(f => {
      const idx = f.ty * w + f.tx;
      if (f.collides) {
        furnData[idx] = f.tile;
      } else {
        decoData[idx] = f.tile;
      }
      if (f.shadowBelow && f.ty + 1 < h) {
        decoData[(f.ty + 1) * w + f.tx] = 36; // SHADOW
      }
    });

    // Objects / Markers
    room.clueMarkers.forEach(cm => {
      objects.push({
        id: nextObjId++, name: cm.id, type: 'clueSpawn',
        x: cm.tx * 32, y: cm.ty * 32, width: 32, height: 32,
        properties: [
          { name: 'zone', type: 'string', value: room.label },
          { name: 'furnitureName', type: 'string', value: cm.furnitureName }
        ]
      });
    });

    room.spawnMarkers.forEach(sm => {
      objects.push({
        id: nextObjId++, name: sm.id, type: 'suspectSpawn',
        x: sm.tx * 32, y: sm.ty * 32, width: 32, height: 32,
        properties: [
          { name: 'zone', type: 'string', value: room.label }
        ]
      });
    });
  });

  return {
    compressionlevel: -1,
    height: h,
    infinite: false,
    layers: [
      {
        data: floorData, height: h, width: w,
        id: 1, name: "floor", opacity: 1, type: "tilelayer", visible: true, x: 0, y: 0
      },
      {
        data: wallsData, height: h, width: w,
        id: 2, name: "walls", opacity: 1, type: "tilelayer", visible: true, x: 0, y: 0,
        properties: [{ name: "collides", type: "bool", value: true }]
      },
      {
        data: furnData, height: h, width: w,
        id: 3, name: "furniture", opacity: 1, type: "tilelayer", visible: true, x: 0, y: 0,
        properties: [{ name: "collides", type: "bool", value: true }]
      },
      {
        data: decoData, height: h, width: w,
        id: 4, name: "decoration", opacity: 1, type: "tilelayer", visible: true, x: 0, y: 0
      },
      {
        draworder: "topdown",
        id: 5, name: "objects", objects: objects,
        opacity: 1, type: "objectgroup", visible: true, x: 0, y: 0
      }
    ],
    nextlayerid: 6,
    nextobjectid: nextObjId,
    orientation: "orthogonal",
    renderorder: "right-down",
    tiledversion: "1.2.4",
    tileheight: 32, tilewidth: 32,
    tilesets: [
      {
        columns: 8, firstgid: 1, image: "mansion_tiles",
        imageheight: 192, imagewidth: 256,
        margin: 0, name: "mansion_tiles", spacing: 0,
        tilecount: 48, tileheight: 32, tilewidth: 32
      }
    ],
    type: "map",
    version: 1.2,
    width: w
  };
}
