import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as PIXI from 'pixi.js';
import {NgIf, NgStyle} from '@angular/common';
import {Assets} from 'pixi.js';
import {Constants} from '../../commons/constants';
import {Roulette} from '../../commons/models';

@Component({
  selector: 'app-pixi-roulette',
  standalone: true,
  imports: [
    NgIf,
    NgStyle
  ],
  templateUrl: './pixi-roulette.component.html',
  styleUrl: './pixi-roulette.component.scss'
})

export class PixiRouletteComponent implements OnInit, OnDestroy {
  @ViewChild('pixiContainer', { static: true }) pixiContainer!: ElementRef;
  app: PIXI.Application = new PIXI.Application();
  wheel: PIXI.Sprite = new PIXI.Sprite();
  isSpinning = false;
  numbers = Constants.rouletteNumbers;
  winningNumber?: Roulette;

  ngOnInit(): void {
    this.setupPixiApp().catch((error) => {
      console.error('Error during Pixi app setup:', error);
    });
  }

   async setupPixiApp(): Promise<void> {
    try {
      await this.initializeContainer();
      await this.addWheel();
    } catch (error) {
      console.error("Error initializing Pixi Roulette:", error);
    }
  }

   async initializeContainer(): Promise<void> {
    await this.app.init({
      resizeTo: window,
      background: '#1099bb',
    });
    this.pixiContainer.nativeElement.appendChild(this.app.canvas);
  }

   async addWheel(): Promise<void> {
    await Assets.load('assets/roulette.png');
    const wheelTexture = PIXI.Texture.from('assets/roulette.png');
    this.wheel = new PIXI.Sprite(wheelTexture);

    this.wheel.anchor.set(0.5);
    this.wheel.x = window.innerWidth / 2;
    this.wheel.y = window.innerHeight / 2;

    this.app.stage.addChild(this.wheel);
    this.addArrow();
  }

   addArrow(): void {
    const arrow = new PIXI.Graphics();
    arrow.fill('rgb(46,7,9)');
    arrow.moveTo(0, 0);
    arrow.lineTo(-20, -50);
    arrow.lineTo(20, -50);
    arrow.lineTo(0, 0);
    arrow.fill();

    arrow.x = window.innerWidth / 2;
    arrow.y = window.innerHeight / 2 - this.wheel.height / 2 -10;

    this.app.stage.addChild(arrow);
  }

  spinWheel(): void {
    this.isSpinning = true;
    const duration = 15000;
    const extraSpins = 10;
    const targetRotation = Math.random() * Math.PI * 2;
    const finalRotation = this.wheel.rotation + extraSpins * Math.PI * 2 + targetRotation;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      this.wheel.rotation = finalRotation * easeOut;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.isSpinning = false;
        this.determineWinningNumber();
      }
    };

    requestAnimationFrame(animate);
  }

   determineWinningNumber(): void {
    const segmentAngle = (2 * Math.PI) / this.numbers.length;
    const normalizedRotation = (this.wheel.rotation % (2 * Math.PI)) + Math.PI * 2;
    const adjustedRotation = normalizedRotation + segmentAngle / 2;
    const winningIndex = Math.floor(adjustedRotation / segmentAngle) % this.numbers.length;

    this.winningNumber = this.numbers[winningIndex];
  }

  ngOnDestroy(): void {
    this.app.destroy(true, { children: true });
  }
}
