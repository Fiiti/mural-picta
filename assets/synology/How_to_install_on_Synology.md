# How to Install MuralPicta on a Synology NAS

This guide walks you through installing MuralPicta on a Synology NAS using **Container Manager** (DSM 7.2+). No SSH or command-line knowledge is required.

---

## Prerequisites

- Synology NAS with DSM 7.2 or newer
- **Container Manager** package installed (available in Package Center)
- Your photos/videos are stored in a shared folder on the NAS (e.g. `photo`)

---

## Step 1 – Create the Config Folder

MuralPicta stores its configuration in a folder on the NAS. This folder must exist before the container starts.

1. Open **File Station**
2. Navigate to the `docker` shared folder  
   *(if it does not exist, create it first: right-click → Create folder → name it `docker`)*
3. Inside `docker`, create a new folder: `muralpicta`
4. Inside `muralpicta`, create another folder: `config`

The final path should be: `/volume1/docker/muralpicta/config`

> **Why a bind mount?**  
> Storing the config on the host means you can view and edit `config.json` directly in File Station — useful if you ever need to reset the admin PIN without SSH.

---

## Step 2 – Open Container Manager

1. Open **Container Manager** from the main menu
2. Go to **Project** in the left sidebar
3. Click **Create**

---

## Step 3 – Create the Project

1. **Project name:** `MuralPicta`
2. **Path:** select or create `/docker/muralpicta` in the file picker
3. **Source:** choose **Create docker-compose.yml**
4. Paste the following into the editor:

```yaml
services:
  wallpanel:
    image: galseq/mural-picta:latest
    container_name: MuralPicta
    restart: on-failure:5
    ports:
      - "3123:3000"
    volumes:
      - /volume1/docker/muralpicta/config:/app/config:rw
      - /volume1/photo:/data/media:ro
    environment:
      - NODE_ENV=production
      - PORT=3000
      - TZ=Europe/Berlin
    mem_limit: 512m
    cpu_shares: 512
    security_opt:
      - no-new-privileges:true
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/status"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s
```

> **Adjust the volume path** `/volume1/photo` to match your actual photo shared folder.  
> If your photos are in a different location (e.g. `/volume1/homes/admin/photos`), change that line accordingly.

5. Click **Next**, review the settings, then click **Done**

Container Manager will pull the image and start the container automatically.

---

## Step 4 – Open MuralPicta

Once the container is running (green status):

| URL | Description |
|-----|-------------|
| `http://<NAS-IP>:3123` | Slideshow (open this on your wall panel / tablet) |
| `http://<NAS-IP>:3123/admin` | Admin interface |

Replace `<NAS-IP>` with your NAS's local IP address (e.g. `192.168.1.100`).  
You can find it in DSM under **Control Panel → Network → Network Interface**.

---

## Step 5 – Configure the Media Path

1. Open the Admin interface: `http://<NAS-IP>:3123/admin`
2. Go to **Media Source**
3. Set **Media Base Path** to `/data/media`  
   *(this is the internal container path mapped to your photos folder)*
4. Click the **Test** button — it should show the number of images and videos found
5. Click **Save** at the top, then restart the container

---

## Folder Structure Example

If your photos are organised by year:

```
/volume1/photo/
├── 2024/
│   ├── Summer/
│   └── Christmas/
├── 2025/
└── 2026/
```

Set `media_base_path` to `/data/media` — the scanner finds all files recursively.

To show only a specific year, open the slideshow with:  
`http://<NAS-IP>:3123/?media_path=2026`

---

## Updating MuralPicta

To update to the latest version:

1. Open **Container Manager → Project → MuralPicta**
2. Click **Action → Stop**
3. Click **Action → Build** (this pulls the latest image)
4. Click **Action → Start**

---

## Resetting the Admin PIN

If you have forgotten the admin PIN:

1. Open **File Station**
2. Navigate to `/docker/muralpicta/config/`
3. Open `config.json` with the text editor
4. Find the line `"admin_pin": "..."` and change the value to `null`:
   ```json
   "admin_pin": null
   ```
5. Save the file
6. Restart the container in Container Manager

The PIN protection is now disabled. You can set a new PIN in the Admin interface under **Security**.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Container starts but shows no images | Check that the volume path `/volume1/photo` is correct and the folder is not empty |
| "Permission denied" in container logs | The container runs as root by default — check that the shared folder has read permissions for **Everyone** |
| Admin shows "no media found" | Verify the **Media Base Path** is set to `/data/media` in the admin |
| Port 3123 already in use | Change `3123:3000` to a free port, e.g. `3456:3000` |
| Container keeps restarting | Open **Container Manager → Container → MuralPicta → Log** to see the error |
