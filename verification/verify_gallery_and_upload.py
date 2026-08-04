import os
from playwright.sync_api import sync_playwright

def run_verification(page):
    page.goto("http://localhost:5173/?test=true")
    page.wait_for_timeout(1000)

    # Scroll to the newly added Touch Gallery Section to capture its state
    page.locator("#gallery").scroll_into_view_if_needed()
    page.wait_for_timeout(800)
    page.screenshot(path="verification/screenshots/gallery_section.png")
    page.wait_for_timeout(500)

    # Scroll down to footer to open the Admin Panel
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(800)
    page.get_by_role("button", name="Admin Panelis").click()
    page.wait_for_timeout(800)

    # Fill in super admin credentials and login
    page.get_by_label("Lietotājvārds / E-pasts").fill("janiszacs")
    page.wait_for_timeout(300)
    page.get_by_label("Parole").fill("VissIzdosies2026")
    page.wait_for_timeout(300)
    page.get_by_role("button", name="Ieiet panelī").click()
    page.wait_for_timeout(1200)

    # Switch to "Galerijas tēli" tab to show file upload controls
    page.get_by_text("Galerijas tēli").click()
    page.wait_for_timeout(800)
    page.screenshot(path="verification/screenshots/admin_gallery_tab.png")
    page.wait_for_timeout(500)

    # Switch to "Spēle & Balvas" tab to show custom reward setup options
    page.get_by_text("Spēle & Balvas").click()
    page.wait_for_timeout(800)
    page.screenshot(path="verification/screenshots/admin_game_rewards.png")
    page.wait_for_timeout(500)

    # Close Admin Panel
    page.get_by_role("button", name="✕").click()
    page.wait_for_timeout(800)

    # Scroll to Booking Form to show dynamic Promo checkout
    page.locator("#booking").scroll_into_view_if_needed()
    page.wait_for_timeout(800)

    # Input a Claimed promo code (GARDEN10)
    page.get_by_label("Dāvanu / Balvas kods").fill("GARDEN10")
    page.wait_for_timeout(800)

    # Take screenshot of the checkout form with dynamic free gift select option active!
    page.screenshot(path="verification/screenshots/booking_promo_select.png")
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
            page.screenshot(path="verification/screenshots/error_v2.png")
        finally:
            context.close()
            browser.close()
