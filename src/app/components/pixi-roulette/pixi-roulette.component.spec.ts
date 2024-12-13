import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PixiRouletteComponent } from './pixi-roulette.component';

describe('PixiRouletteComponent', () => {
  let component: PixiRouletteComponent;
  let fixture: ComponentFixture<PixiRouletteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PixiRouletteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PixiRouletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
