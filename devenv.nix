{ pkgs, config, ... }:

{
  #=============================================================================
  # LANGUAGES
  #=============================================================================

  # JavaScript/TypeScript with Bun runtime
  languages.javascript = {
    enable = true;
    bun.enable = true;
  };

  # Python 3.12 for the Crawl4AI scraper
  languages.python = {
    enable = true;
    version = "3.12";
  };

  #=============================================================================
  # SYSTEM PACKAGES
  #=============================================================================

  packages = with pkgs; [
    uv                               # Python package manager
    figlet                           # ASCII art for welcome banner
    playwright-driver.browsers       # Playwright browsers for the scraper
  ];

  #=============================================================================
  # ENVIRONMENT VARIABLES
  #=============================================================================

  env = {
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD = "1";
    PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";
  };

  enterShell = ''
    # Welcome banner
    ${pkgs.figlet}/bin/figlet -f slant "react-monorepo" 2>/dev/null
    d=$(tput dim 2>/dev/null || echo ""); r=$(tput sgr0 2>/dev/null || echo "")
    echo "$d"bun"$r" $(${pkgs.bun}/bin/bun --version 2>/dev/null)  "$d"python"$r" $(${pkgs.python3}/bin/python3 --version 2>/dev/null | cut -d' ' -f2)
    echo ""

    # Resolve Playwright Chromium executable path
    export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=$(
      find ${pkgs.playwright-driver.browsers}/chromium-*/chrome-linux*/ \
        -name chrome -type f | head -1
    )
  '';

  #=============================================================================
  # SCRIPTS (available in devenv shell)
  #=============================================================================

  scripts = {
    dev.exec = "bun run dev";
    dev_all.exec = "bun run dev:all";
    dev_scraper.exec = "bun run dev:scraper";

    build.exec = "bun run build";
    test.exec = "bun run test";
    lint.exec = "bun run lint";
    typecheck.exec = "bun run typecheck";

    seed.exec = "bun run seed";
    convex_dashboard.exec = "bun run convex:dashboard";
  };

  #=============================================================================
  # PROCESSES (start with `devenv up`)
  #=============================================================================

  processes = {
    web.exec = "bun run --cwd apps/web dev";
    worker.exec = "bun run --cwd apps/worker dev";
    convex.exec = "bun run --cwd packages/convex dev";
  };
}
