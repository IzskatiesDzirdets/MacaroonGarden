from playwright.sync_api import sync_playwright

def run_cuj(page):
    page.goto("http://localhost:5173/?test=true")
    page.wait_for_timeout(1000)

    # Click on the CMS Administrators button in the footer to open the AdminPanel
    page.click("text=CMS Administrators")
    page.wait_for_timeout(1000)

    # Fill out 'janiszacs' with recovery password 'VissIzdosies2026'
    page.fill("input[placeholder='Ievadiet segvārdu...']", "janiszacs")
    page.fill("input[placeholder='••••••••']", "VissIzdosies2026")
    page.wait_for_timeout(500)

    # Submit login
    page.click("button:has-text('Ielogoties Panelī')")
    page.wait_for_timeout(1500)

    # Now we are inside! Click the Gallery section (Premium Galerija) and check
    page.click("button:has-text('Premium Galerija')")
    page.wait_for_timeout(1000)

    # Capture visual proof
    page.screenshot(path="verification/screenshots/admin_verified.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
