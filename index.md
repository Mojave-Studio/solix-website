# Solix — your Mac, in your pocket

Terminals, agents, and controls — ready on your iPhone.

Mac + iPhone · Wi-Fi or Tailscale

## The system

Your Mac stays put. You stay close. Open a terminal, guide an agent, or control
your Mac from your iPhone.

- **Control** — status, awake, brightness, lock.
- **Terminal** — shells and project work.
- **First Mate** — instructions, commands, skills, Git.

## Get Solix

Put Solix on a machine, then pair your iPhone.

[Download the host](https://solix.fyi/Solix-macOS.zip) — macOS, Windows, Linux.

### Install & CLI — macOS

This download is signed for local use and is not notarized. The commands below
remove its quarantine attribute. Only run them if you trust this download.

```sh
curl -fLO https://solix.fyi/Solix-macOS.zip && unzip Solix-macOS.zip && cd Solix
xattr -dr com.apple.quarantine Solix.app   # signed run-locally, not notarized
open Solix.app                            # menu bar — keep it running
./solix install                           # CLI → ~/.local/bin · app + login agent
```

Optional: install the Solix skills so your coding agent can use the host CLI.

```sh
solix skill add Mojave-Studio/solix-skills   # inside a running host
# or standalone — link into every agent's skills dir:
git clone https://github.com/Mojave-Studio/solix-skills ~/.config/solix-skills
~/.config/solix-skills/install.sh
```

[Full CLI setup guide](https://raw.githubusercontent.com/Mojave-Studio/solix-skills/main/README.md)

### Install & CLI — Windows

Single binary — no installer. Put it somewhere stable and keep it running.

```powershell
irm https://solix.fyi/solix-host-windows.exe -OutFile solix-host.exe
.\solix-host.exe serve     # starts the host
.\solix-host.exe invite    # print a pairing invite
```

Autostart: shortcut to `solix-host.exe serve` in `shell:startup`, or a Scheduled Task.

### Install & CLI — Linux

Single binary — install to `~/.local/bin`, then run directly or as a user service.

```sh
curl -fLO https://solix.fyi/solix-host-linux && chmod +x solix-host-linux
mkdir -p ~/.local/bin && mv solix-host-linux ~/.local/bin/solix-host
solix-host serve           # starts the host

# autostart as a user service (optional):
mkdir -p ~/.config/systemd/user
curl -fLo ~/.config/systemd/user/solix-host.service https://solix.fyi/solix-host.service
systemctl --user enable --now solix-host   # headless: solix-host@<user> instead
```

### Security

Use a trusted LAN or Tailscale. The downloadable host uses authenticated,
unencrypted transport; do not expose it directly to the public internet. Device
permissions govern remote actions. Secrets are stored in the Mac's Keychain and
supplied to permitted processes.

### iPhone & remote access

You'll need the Solix iPhone app. For remote access, use Tailscale and keep the
Mac host running.

---

solix.fyi · [Privacy](https://solix.fyi/privacy) · [User Agreement](https://solix.fyi/terms) · [Back to the site](https://solix.fyi/)
