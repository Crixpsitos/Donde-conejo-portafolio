import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL('http://localhost:3000/admin')
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await expect(page).toHaveURL('http://localhost:3000/admin/collections/users')
    const listViewArtifact = page.locator('h1', { hasText: 'Users' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users/create')
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })

  test('highlights the exact value for the focused homepage field', async () => {
    await page.goto('http://localhost:3000/admin/globals/homepage')

    const previewFrame = page.locator('iframe[src*="preview="]')
    await expect(previewFrame).toBeVisible()
    const preview = page.frameLocator('iframe[src*="preview="]')
    await expect(preview.locator('[data-preview-field="hero.name"]')).toBeVisible()

    await page.getByRole('button', { name: '01 · Hero' }).click()
    await page.locator('input[name="hero.name"]').focus()
    await expect(preview.locator('[data-preview-field="hero.name"]')).toHaveAttribute(
      'data-preview-active',
      'true',
    )

    await page.getByRole('button', { name: '04 · Investigación' }).click()
    await page.locator('input[name="research.title"]').focus()
    await expect(preview.locator('[data-preview-field="research.title"]')).toHaveAttribute(
      'data-preview-active',
      'true',
    )
    await expect(preview.locator('[data-preview-field="hero.name"]')).not.toHaveAttribute(
      'data-preview-active',
      'true',
    )

    await previewFrame.evaluate((frame: HTMLIFrameElement) => {
      frame.contentWindow?.postMessage(
        {
          type: 'donde-conejo:highlight-field',
          fieldPath: 'research.topics.0.title',
        },
        new URL(frame.src).origin,
      )
    })
    await expect(preview.locator('[data-preview-field="research.topics.0.title"]')).toHaveAttribute(
      'data-preview-active',
      'true',
    )
    await expect(preview.locator('[data-preview-field="research.title"]')).not.toHaveAttribute(
      'data-preview-active',
      'true',
    )
  })
})
