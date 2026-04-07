# Forgot your PIN?

If you can no longer access the Admin Panel because you have forgotten your PIN, you can reset it manually by editing a text file on the server.

---

## Where is the configuration file?

The file is called **`config.json`** and contains all settings for MuralPicta.

### If you are running MuralPicta via Docker

The file is located in the Docker volume you mapped when starting the container. If you followed the standard setup, it is in a folder on your computer or NAS that you specified as the config volume, for example:

```
/your-folder/config/config.json
```

On a **Synology NAS** you can find this folder in the File Station. On a **Windows PC** you can open it in Explorer.

### If you installed MuralPicta directly (without Docker)

The file is in the project folder:

```
wallpanel_webserver/server/config/config.json
```

---

## Step-by-step: Reset PIN

**1. Open the file `config.json`** with any text editor (e.g. Notepad, TextEdit, VS Code, or the text editor in your NAS interface).

**2. Find the following line:**

```json
"admin_pin": "abc123..."
```

The value after the colon will look different — it is a long encrypted string.

**3. Replace the value with `null`** (without any quotation marks):

```json
"admin_pin": null
```

The result should look like this in the file:

```json
{
  "admin_pin": null,
  ...other settings...
}
```

**4. Save the file.**

**5. Restart MuralPicta** (or the Docker container). After the restart, the Admin Panel is accessible again without a PIN.

---

## Important notes

- Write `null` **without** quotation marks. `"null"` (with quotes) would be treated as the text "null" and would not work correctly.
- Do **not** delete the line entirely — just replace the value with `null`.
- After resetting, you can set a new PIN directly in the Admin Panel under **Security**.

---

## Still having trouble?

If the file cannot be found or the change does not take effect, check:

- Is the correct config volume mapped in Docker?
- Has the container/server been fully restarted (not just reloaded)?
- Is the JSON still valid? Every line except the last must end with a comma. You can check your file at [jsonlint.com](https://jsonlint.com).
