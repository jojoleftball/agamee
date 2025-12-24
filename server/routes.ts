import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "client", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storageConfig = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storageConfig,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);
    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/upload", upload.single("sprite"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      path: relativePath,
      filename: req.file.filename,
      originalName: req.file.originalname,
    });
  });

  app.get("/api/uploads", (_req, res) => {
    try {
      const files = fs.readdirSync(uploadDir);
      const images = files
        .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
        .map((f) => ({
          filename: f,
          path: `/uploads/${f}`,
        }));
      res.json({ images });
    } catch (error) {
      res.json({ images: [] });
    }
  });

  app.delete("/api/uploads/:filename", (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "File not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete file" });
    }
  });

  // Admin config save/load
  const adminConfigPath = path.join(process.cwd(), "admin-config.json");

  app.get("/api/admin-config", (req, res) => {
    try {
      if (fs.existsSync(adminConfigPath)) {
        const config = JSON.parse(fs.readFileSync(adminConfigPath, "utf-8"));
        res.json(config);
      } else {
        res.json({});
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to load config" });
    }
  });

  app.post("/api/admin-config", (req, res) => {
    try {
      fs.writeFileSync(adminConfigPath, JSON.stringify(req.body, null, 2));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save config" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
