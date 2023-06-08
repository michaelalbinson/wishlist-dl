# wishlist-dl

A tool for making your wildest dreams come true. Whipped up in a weekend.  Download videos, translate
them to `.mp3` files and automatically match them with metadata from spotify.

**Use only for videos/music you legally own.**

## Prereqs
Wishlist-dl depends on already having `yt-dlp` and `ffmpeg` installed to work
as well as a Spotify App client ID and secret.

### Install dependencies
On macOS:

```bash
brew install yt-dlp
```

```bash
brew install ffmpeg
```

### Set up `.env` file
Set up a Spotify developer app [here](https://developer.spotify.com/).

Create a `.env` file in the root of this project by copying the
`sample.env` file and filling in you Spotify app id and secret.

## Usage
If developing locally run `npm run build && npm i -g .` to build the project
and run it locally via `wishlist-dl`.

### Rematch
Rematch a single `.mp3` file with data scraped from Spotify using the file name
and the provided hint.

### Wishlist
Downloads the video links found in the wishlist file, translates them to `.mp3` files
and matches them to metadata scraped from spotify.

The wishlist should be a list of URLs in a txt file separated by newlines.

You can update the parallelism of downloads using the `--parallelism n` option
but be aware that google may rate limit you.

### Regenerate-Metadata
Processes the provided directory again to match and scrape spotify
data to the mp3 files in the directory

### m3u
Generates a `.m3u` playlist file for the provided directory

### cleanup
Remove all original mp3 files from `./downloads`

### help
Print the help command