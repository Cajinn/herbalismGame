import { isPressed } from "../engine/input.js";
import { isSolid } from "../engine/tilemap.js";

const SPEED = 64; // world pixels per second

export function createPlayer(map) {
  const { x, y } = map.playerSpawn;
  return {
    x: x * map.tileSize,
    y: y * map.tileSize,
    width: map.tileSize,
    height: map.tileSize,
    direction: "down",
    moving: false,
  };
}

export function updatePlayer(player, map, dt) {
  let dx = 0;
  let dy = 0;
  if (isPressed("up")) dy -= 1;
  if (isPressed("down")) dy += 1;
  if (isPressed("left")) dx -= 1;
  if (isPressed("right")) dx += 1;

  player.moving = dx !== 0 || dy !== 0;
  if (!player.moving) return;

  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }

  if (dy < 0) player.direction = "up";
  else if (dy > 0) player.direction = "down";
  else if (dx < 0) player.direction = "left";
  else if (dx > 0) player.direction = "right";

  tryMove(player, dx * SPEED * dt, 0, map);
  tryMove(player, 0, dy * SPEED * dt, map);
}

function tryMove(player, dx, dy, map) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  if (!collides(newX, newY, player, map)) {
    player.x = newX;
    player.y = newY;
  }
}

function collides(x, y, player, map) {
  const { tileSize } = map;
  const corners = [
    [x, y],
    [x + player.width - 1, y],
    [x, y + player.height - 1],
    [x + player.width - 1, y + player.height - 1],
  ];
  return corners.some(([cx, cy]) =>
    isSolid(map, Math.floor(cx / tileSize), Math.floor(cy / tileSize)),
  );
}
