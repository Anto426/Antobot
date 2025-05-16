# Configuration Files Notice

The JSON files included in this repository are **examples** of the configuration files required to properly run the bot.

The real configuration files, containing sensitive data such as cookies ad id, are stored in a **private repository** for security reasons.

---

## Configuration Location

The bot expects the main configuration file at:

`config/setting.json`

This file typically contains sensitive information such as the remote GitHub repository URL used for automatic updates.

---

## How to Use These Examples

Anyone who wants to implement or customize the bot can:

- Create a new Git repository (public or private) for their own configuration files.  
- Modify the example files provided here by replacing links, and other parameters with their own values (the remote GitHub repo URL found in `config/setting.json`).  
- Make sure **not to share sensitive information** like cookies publicly.

This way, the bot can be configured and run correctly while keeping private data secure.

---

## Where to Find the Repository Link

The link to the GitHub repository is **not hard-coded** in the code but centralized in a configuration file.  
Open `config/setting.json` and look for the following entry:

```json
{
  "remote": {
    "github": {
      "urlrepo": "https://github.com/your-username/your-repo.git"
    }
  }
}
