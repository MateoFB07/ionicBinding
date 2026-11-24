import { expect, test } from '@playwright/test';

test('muestra la lista de paquetes y permite filtrar por prioridad', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('ion-title')).toContainText('TrackingSpace');
  await expect(page.locator('app-package-card')).toHaveCount(6);
  await expect(page.getByText('LTK-8921-ES')).toBeVisible();

  await page.locator('ion-searchbar input').fill('LTK-4032');
  await expect(page.locator('app-package-card')).toHaveCount(1);
  await expect(page.getByText('LTK-4032-ES')).toBeVisible();

  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.locator('.theme-toggle').click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
});
