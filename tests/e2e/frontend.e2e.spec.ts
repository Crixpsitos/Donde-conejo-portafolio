import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('renders the localized editorial homepage', async ({ page }) => {
    await page.goto('http://localhost:3000/')

    await expect(page).toHaveURL(/\/es$/)
    await expect(page).toHaveTitle(/Conejo/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conejo')
    await expect(
      page.getByRole('heading', { name: 'En la barra: oficio y extracción' }),
    ).toBeVisible()
  })

  test('opens mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000/es')

    await page.getByRole('button', { name: 'Abrir menú' }).click()
    await expect(page.getByRole('navigation', { name: 'Navegación móvil' })).toBeVisible()
  })
})
