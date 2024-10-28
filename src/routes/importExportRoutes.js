import express from "express"

import { 
    exportAllCollections,
    importAllCollections,
    upload
  } from "../controllers/importExportController.js"
  const importExportRoutes = express.Router({ mergeParams: true })
  importExportRoutes.get('/exportAllCollections', exportAllCollections)
  importExportRoutes.post('/importAllCollections',upload.single('file'), importAllCollections)

export default importExportRoutes