import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenScalingComponent } from './token-scaling.component';

describe('TokenScalingComponent', () => {
  let component: TokenScalingComponent;
  let fixture: ComponentFixture<TokenScalingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenScalingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenScalingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
