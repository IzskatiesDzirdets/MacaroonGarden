import os
from playwright.sync_api import sync_playwright

def run_verification(page):
    # Navigate to local dev server
    page.goto("http://localhost:5173/?test=true")
    page.wait_for_timeout(1000)

    # Scroll down to footer to click the Admin Panel link
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(800)

    # Click on the Admin Panelis link in the footer
    page.get_by_role("button", name="Admin Panelis").click()
    page.wait_for_timeout(800)

    # Fill in the login form
    # Username: janiszacs, Password: VissIzdosies2026
    page.get_by_label("Lietotājvārds / E-pasts").fill("janiszacs")
    page.wait_for_timeout(400)
    page.get_by_label("Parole").fill("VissIzdosies2026")
    page.wait_for_timeout(400)

    # Click Login
    page.get_by_role("button", name="Ieiet panelī").click()
    page.wait_for_timeout(1200)

    # We are now in the Admin Dashboard!
    # Let's take a screenshot of the Sections Manager
    page.screenshot(path="verification/screenshots/admin_sections.png")
    page.wait_for_timeout(800)

    # Switch to "CMS Teksti" tab using text-based matching
    page.get_by_text("CMS Teksti").click()
    page.wait_for_timeout(800)

    # Change the Hero title field with exact=True matching
    page.get_by_label("title", exact=True).fill("Ekskluzīvi un burvīgi")
    page.wait_for_timeout(800)

    # Take screenshot of CMS tab
    page.screenshot(path="verification/screenshots/admin_cms.png")
    page.wait_for_timeout(800)

    # Switch to "Garšu saraksts" tab
    page.get_by_text("Garšu saraksts").click()
    page.wait_for_timeout(800)
    page.screenshot(path="verification/screenshots/admin_flavours.png")
    page.wait_for_timeout(800)

    # Close Admin Panel to confirm instant updates
    page.get_by_role("button", name="✕").click()
    page.wait_for_timeout(800)

    # Scroll back to top
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(800)

    # Take final landing page screenshot showing the updated "Ekskluzīvi un burvīgi" title
    page.screenshot(path="verification/screenshots/updated_hero.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("verification/screenshots", exist_ok=True)
    os.makedirs("verification/videos", exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_verification(page)
        except Exception as e:
            print("ERROR:", e)
            page.screenshot(path="verification/screenshots/error.png")
        finally:
            context.close()
            browser.close()
