import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaComponent } from './galeria.component';

describe('GaleriaComponent', () => {
  let component: GaleriaComponent;
  let fixture: ComponentFixture<GaleriaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GaleriaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render users from the service', async () => {
    fixture.detectChanges();
    await component.ngOnInit();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Juan');
    expect(text).toContain('juan@example.com');
  });
});
