{
  description = "seichi-portal-frontend development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    { nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.mise
          ];
          shellHook = ''
            mise install || exit 1
            seichi_mise_env=$(mise env --shell bash) || exit 1
            eval "$seichi_mise_env"
            unset seichi_mise_env
          '';
        };
      }
    );
}
