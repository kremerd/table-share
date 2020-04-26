import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenUploadComponent } from './token-upload.component';

describe('TokenUploadComponent', () => {
  let component: TokenUploadComponent;
  let fixture: ComponentFixture<TokenUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
