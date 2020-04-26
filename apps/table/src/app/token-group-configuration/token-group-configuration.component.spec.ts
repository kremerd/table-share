import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenGroupConfigurationComponent } from './token-group-configuration.component';

describe('TokenGroupConfigurationComponent', () => {
  let component: TokenGroupConfigurationComponent;
  let fixture: ComponentFixture<TokenGroupConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenGroupConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenGroupConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
