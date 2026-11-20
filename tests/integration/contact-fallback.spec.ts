import { test, expect } from "@playwright/test";
test("static contact does not submit message data as a query when JavaScript is unavailable", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/contact/");
  await expect(
    page
      .getByRole("link", { name: "chauanhdung@gmail.com", exact: true })
      .first(),
  ).toHaveAttribute("href", "mailto:chauanhdung@gmail.com");
  await expect(
    page.getByRole("button", { name: "Open email app" }),
  ).toBeDisabled();
  await context.close();
});
