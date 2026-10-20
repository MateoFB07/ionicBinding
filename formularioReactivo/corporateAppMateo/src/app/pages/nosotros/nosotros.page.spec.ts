import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NosotrosPage } from './nosotros.page';
import { GeolocationService } from '../../services/geolocation-service';

describe('NosotrosPage', () => {
  let component: NosotrosPage;
  let fixture: ComponentFixture<NosotrosPage>;
  const position = {
    latitude: 40.4,
    longitude: -3.7,
    accuracy: 10,
    altitudeAccuracy: null,
    altitude: null,
    speed: null,
    heading: null,
    magneticHeading: null,
    trueHeading: null,
    headingAccuracy: null,
    course: null
  };

  beforeEach(() => {
    const geolocationService = {
      getCurrentPosition: vi.fn().mockResolvedValue(position),
      calcularDistancia: vi.fn().mockReturnValue(2.5),
      oficinaLat: 40.4452,
      oficinaLon: -3.6115
    };

    TestBed.configureTestingModule({
      providers: [{ provide: GeolocationService, useValue: geolocationService }]
    });
    fixture = TestBed.createComponent(NosotrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the calculated distance after obtaining the location', async () => {
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.distancia()).toBe(2.5);
  });

  it('allows the user to retry after a location failure', async () => {
    const geolocationService = TestBed.inject(GeolocationService);
    vi.mocked(geolocationService.getCurrentPosition)
      .mockRejectedValueOnce(new Error('Location timed out'))
      .mockResolvedValueOnce(position);

    await component.actualizarUbicacion();
    expect(component.errorUbicacion()).toBe('Location timed out');

    await component.actualizarUbicacion();
    expect(component.distancia()).toBe(2.5);
    expect(component.errorUbicacion()).toBeNull();
  });
});
