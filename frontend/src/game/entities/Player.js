import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, playerId, name, isLocal = false, tintColor = 0xffffff) {
    super(scene, x, y, 'character_spritesheet', 0);
    this.scene = scene;
    this.playerId = playerId;
    this.name = name;
    this.isLocal = isLocal;

    this.setScale(2.2);
    this.setTint(tintColor);

    // 2. Add Name Label above player
    this.nameLabel = scene.add.text(x, y - 40, name, {
      fontSize: '11px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#ffffff',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5);

    // 3. Add Ready Status indicator (for lobby)
    this.statusLabel = scene.add.text(x, y - 56, '', {
      fontSize: '9px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // 4. Add to scene and enable physics
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics body size (scaled proportionately)
    this.setCollideWorldBounds(true);
    // Use a very small hitbox centered at the feet so they don't snag on corners
    this.body.setSize(12, 12);
    this.body.setOffset(10, 20);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.nameLabel) this.nameLabel.setPosition(this.x, this.y - 40);
    if (this.statusLabel && this.statusLabel.visible) this.statusLabel.setPosition(this.x, this.y - 56);
  }

  setReadyStatus(isReady) {
    if (!this.statusLabel || !this.statusLabel.scene) return;
    if (isReady) {
      this.statusLabel.setText('READY').setColor('#4ade80');
    } else {
      this.statusLabel.setText('WAITING').setColor('#9ca3af');
    }
  }

  hideReadyStatus() {
    if (this.statusLabel && this.statusLabel.scene) {
      this.statusLabel.setVisible(false);
    }
  }

  animate(vx, vy, dir) {
    const moving = Math.abs(vx) > 5 || Math.abs(vy) > 5;
    if (moving) {
      const currentDir = dir || this.getDirection(vx, vy) || 'down';
      this.play(`walk_${currentDir}`, true);
    } else {
      this.stop();
      const currentDir = dir || 'down';
      if (currentDir === 'down') this.setFrame(0);
      else if (currentDir === 'left') this.setFrame(3);
      else if (currentDir === 'right') this.setFrame(6);
      else if (currentDir === 'up') this.setFrame(9);
    }
  }

  move(vx, vy, dir) {
    if (this.body) {
      this.body.setVelocity(vx, vy);
      this.animate(vx, vy, dir);
    }
  }

  getDirection(vx, vy) {
    if (Math.abs(vx) > Math.abs(vy)) {
      return vx > 0 ? 'right' : 'left';
    } else if (Math.abs(vy) > 0) {
      return vy > 0 ? 'down' : 'up';
    }
    return null;
  }

  destroy(fromScene) {
    if (this.nameLabel) this.nameLabel.destroy();
    if (this.statusLabel) this.statusLabel.destroy();
    super.destroy(fromScene);
  }
}
