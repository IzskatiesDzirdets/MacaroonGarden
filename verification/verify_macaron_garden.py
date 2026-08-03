import os
from playwright.sync_api import sync_playwright

def run_cuj(page, context):
    print("Intercepting and mocking all external requests...")

    def handle_external_route(route):
        url = route.request.url
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Content-Type": "application/json"
        }
        if "localhost" in url:
            route.continue_()
            return
        if route.request.method == "OPTIONS":
            route.fulfill(status=204, headers=headers)
        elif "supabase.co" in url:
            if "/auth/v1/" in url:
                route.fulfill(status=200, headers=headers, body='{"session":null,"user":null}')
            elif "/rest/v1/" in url:
                route.fulfill(status=200, headers=headers, body='[]')
            else:
                route.fulfill(status=200, headers=headers, body='{}')
        elif ".hdr" in url:
            route.fulfill(status=404, headers=headers, body='')
        else:
            route.fulfill(status=200, headers=headers, body='{}')

    context.route("**", handle_external_route)

    # Attach console and error logging for debugging
    page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
    page.on("console", lambda msg: print(f"BROWSER CONSOLE {msg.type}: {msg.text}"))

    print("Opening Macaroon Garden high-end home page...")
    page.goto("http://localhost:5173/?test=true") # Load with test=true to disable WebGL and ensure speed

    # 1. Wait for Booking Form to render instantly
    print("Waiting for Booking Section to render...")
    booking_section = page.locator("#booking")
    booking_section.wait_for(state="visible", timeout=15000)

    print("Scrolling to Booking Section...")
    booking_section.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)

    # 2. Navigate to August (Next Month) using JS click
    print("Navigating to next month (August 2026)...")
    page.locator("#booking .flex.items-center.justify-between.mb-4 button").nth(1).evaluate("el => el.click()")
    page.wait_for_timeout(1500)

    # 3. Select an available date in August (August 2nd!)
    print("Selecting first available date in August...")
    page.locator("#booking .cal-day.avail").first.evaluate("el => el.click()")
    page.wait_for_timeout(1500)

    # 4. Select the first 2-hour block chip
    print("Selecting the 10:00 - 12:00 block chip...")
    page.locator("button", has_text="10:00 - 12:00").first.click()
    page.wait_for_timeout(1500)

    # 5. Fill out form details
    print("Filling out client details in the form...")
    page.locator("#bk-name").fill("Kristaps Ozols")
    page.locator("#bk-phone").fill("+371 29999999")
    page.locator("#bk-email").fill("kristaps.ozols@gmail.com")
    page.locator("#bk-address").fill("Kalnciema iela 40, Rīga")
    page.locator("#bk-notes").fill("Lūdzu, piegādāt tieši pusdienlaikā, paldies!")
    page.wait_for_timeout(1500)

    # Take screenshot of the gorgeous booking form and calendar side-by-side
    screenshot_dir = "verification/screenshots"
    os.makedirs(screenshot_dir, exist_ok=True)
    screenshot_path = os.path.join(screenshot_dir, "verification.png")
    page.screenshot(path=screenshot_path)
    print(f"Screenshot successfully captured at {screenshot_path}")
    page.wait_for_timeout(1500)

if __name__ == "__main__":
    video_dir = "verification/videos"
    os.makedirs(video_dir, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir=video_dir,
            viewport={"width": 1280, "height": 950}
        )
        page = context.new_page()
        try:
            run_cuj(page, context)
        except Exception as e:
            print(f"Error during CUJ execution: {e}")
        finally:
            context.close()
            browser.close()
            print("Done verifying.")
