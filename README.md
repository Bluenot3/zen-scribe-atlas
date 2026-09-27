# One Page. Always Advancing.

### An AI & automation proposal for One Page Business Plan, by ZEN AI Co.

**[Open the interactive proposal →](https://bluenot3.github.io/zen-scribe-atlas/)**

**[Read the implementation brief PDF →](https://bluenot3.github.io/zen-scribe-atlas/automation-proposal.pdf)**

The complete proposal website now lives in this repository: 18 opportunities, six interactive walkthroughs, a capacity calculator, the proposed rollout, source register, original artwork and downloadable implementation brief. The PDF covers opportunities 01–06; the website contains the full 18-opportunity assessment.

The original published Sites version is also available at [zen-onepage-next.zenagi.chatgpt.site](https://zen-onepage-next.zenagi.chatgpt.site/).

## Preserved publication

This repository imports published **version 5** from Sites project `appgprj_6ab726502c008191b042de8ebedcb61e`, source commit `d579bcddb876458a11095254f0e9226064355681`.

The application source, CSS, components, dependencies, images and PDF are unchanged from that publication. The original starter README is retained in [docs/SITES-STARTER.md](docs/SITES-STARTER.md). [docs/SOURCE-SNAPSHOT.json](docs/SOURCE-SNAPSHOT.json) records SHA-256 checksums for every imported source file.

GitHub Pages exports a temporary build copy using the project's existing Next.js dependency. Only that temporary copy's asset paths are prefixed with `/zen-scribe-atlas`; the original Sites application files stay intact. No API keys or backend services are required for the public proposal. The illustrative demos retain their existing behavior and do not send messages or access private records.

## Run locally

Use Node.js 24 and pnpm 11.25.0, matching the checked-in package manager version and lockfile.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Publish on GitHub Pages

Every push to `main` runs [the publishing workflow](.github/workflows/pages.yml), builds the site and deploys it to GitHub Pages. GitHub repository settings must use **Pages → Source → GitHub Actions**.

To generate the same static output locally:

```sh
node scripts/build-github-pages.mjs
```

The result is in `out/`. Serve it under `/zen-scribe-atlas/`. Set `PAGES_BASE_PATH` to an empty string when building for a domain root, or to another slash-prefixed repository path when relocating the site.

## Repository history

The former Scribe Atlas application's files have been replaced on `main`. Its last revision remains recoverable through the tag [`archive/scribe-atlas-before-one-page-2026-09-27`](https://github.com/Bluenot3/zen-scribe-atlas/tree/archive/scribe-atlas-before-one-page-2026-09-27) and the existing Git history. No history was force-pushed or erased.

The existing Sites deployment remains independent. Future GitHub commits deploy GitHub Pages; they do not automatically republish the original Sites URL.
