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
      # Toggle workspace target dependencies here.
      enableMobile = false;
      enableDesktop = false;
      enablePlaywright = false;

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
          packages =
            with pkgs;
            [
              bun
            ]
            ++ pkgs.lib.optionals enableMobile [
              uv
            ]
            ++ pkgs.lib.optionals enablePlaywright [
              playwright-test
            ]
            ++ pkgs.lib.optionals enableMobile [
              # Mobile currently reuses Bun/Node tooling and has no extra native deps.
            ]
            ++ pkgs.lib.optionals enableDesktop [
              cargo
              rustc
              pkg-config
              glib
              glib-networking
              gsettings-desktop-schemas
              gtk3
              webkitgtk_4_1
              libsoup_3
              cairo
              pango
              gdk-pixbuf
              dbus
              openssl
              librsvg
            ];

          shellHook = pkgs.lib.concatStringsSep "\n" (
            []
            ++ pkgs.lib.optionals enablePlaywright [
              ''
                export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
                export PLAYWRIGHT_BROWSERS_PATH="${pkgs.playwright-driver.browsers}"
                export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$(find ${pkgs.playwright-driver.browsers}/chromium-*/chrome-linux*/ -name chrome -type f | head -1)"
              ''
            ]
            ++ pkgs.lib.optionals enableDesktop [
              ''
                export GIO_MODULE_DIR="${pkgs.glib-networking}/lib/gio/modules"
                export XDG_DATA_DIRS="${pkgs.gsettings-desktop-schemas}/share/gsettings-schemas/${pkgs.gsettings-desktop-schemas.name}:${pkgs.gtk3}/share/gsettings-schemas/${pkgs.gtk3.name}:$XDG_DATA_DIRS"
                export LD_LIBRARY_PATH="${pkgs.lib.makeLibraryPath [
                  pkgs.webkitgtk_4_1
                  pkgs.gtk3
                  pkgs.glib
                  pkgs.libsoup_3
                  pkgs.cairo
                  pkgs.pango
                  pkgs.gdk-pixbuf
                  pkgs.openssl
                ]}:$LD_LIBRARY_PATH"
              ''
            ]
          );
        };
      });
    };
}
