import { test, expect } from '@playwright/test';

test.describe('Homepage visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    // Wait for animations to settle
    await page.waitForTimeout(500);
  });

  test('full page @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('404 page @visual', async ({ page }) => {
    await page.goto('/404');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('404-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('CV page @visual', async ({ page }) => {
    await page.goto('/cv');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('cv-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Homepage dark mode visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    // Force dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
  });

  test('full page dark mode @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full-dark.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Homepage reduced motion visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    // Force reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(500);
  });

  test('full page reduced motion @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full-reduced-motion.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Mobile viewport visual regression', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(500);
  });

  test('mobile full page @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile 404 page @visual', async ({ page }) => {
    await page.goto('/404');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('404-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('mobile CV page @visual', async ({ page }) => {
    await page.goto('/cv');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot('cv-page-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});

test.describe('Mobile dark mode visual regression', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => document.fonts.ready.then(() => true));
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(500);
  });

  test('mobile full page dark mode @visual', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-full-dark-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});