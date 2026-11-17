import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { PackageCardComponent } from './package-card.component';

describe('PackageCardComponent', () => {
  let component: PackageCardComponent;
  let fixture: ComponentFixture<PackageCardComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCardComponent);
    fixture.componentRef.setInput('packageData', {
      id: 'test-package',
      trackingCode: 'LTK-1234-ES',
      destinationHub: 'HUB-MAD-BARAJAS',
      weightKg: 1,
      priority: 'STANDARD',
      status: 'IN_TRANSIT',
      timestamp: new Date('2026-01-01T00:00:00'),
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
