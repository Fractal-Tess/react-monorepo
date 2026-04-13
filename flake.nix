{
  description = "react-monorepo development shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default-linux";
    playwright.url = "github:pietdevries94/playwright-web-flake";
  };

  outputs =
    {
      nixpkgs,
      systems,
      playwright,
      ...
    }:
    let
      eachSystem =
        f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          let
            overlay = final: prev: {
              inherit (playwright.packages.${system}) playwright-driver playwright-test;
            };
            pkgs = import nixpkgs {
              inherit system;
              overlays = [ overlay ];
            };
          in
          f pkgs
        );
    in
    {
      devShells = eachSystem (pkgs: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            uv
            playwright-test
          ];

          shellHook = ''
            export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
            export PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}"
            export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$(find ${pkgs.playwright-driver.browsers}/chromium-*/chrome-linux*/ -name chrome -type f | head -1)"
          '';
        };
      });
    };
}
