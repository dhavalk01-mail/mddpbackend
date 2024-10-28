import multer from 'multer';
import path from 'path';
import fs from 'fs'
import mongoose from 'mongoose';

// Multer configuration for handling file uploads

//const upload = multer({ dest: 'uploads/' });
// Helper function to get current date and time in 12-hour format

function getCurrentDateTime() {
  const date = new Date();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${year}-${month}-${day}_${hours}-${formattedMinutes}${ampm}`;

}

// Import JSON file into MongoDB
const importAllCollections = async (req, res) => {
  try {
    const db = mongoose.connection.db
    const filePath = req.file.path
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    try {
      for (const collectionName in data) {
        const documents = data[collectionName]
        if (documents.length > 0) {
          //console.log("=========",db.collection(collectionName))
          await db.collection(collectionName).deleteMany({});
          //await db.collection(collectionName).insertMany(documents)  

          await db.collection(collectionName).insertMany(documents.map(item => autoDetectObjectIds(item)));
        }
      }

      res.status(500).send('Imported successfully');
    } catch (error) {
      // console.log("----------", error.message)
      res.status(500).send('Failed to import data');
    } finally {
      fs.unlinkSync(filePath); // Delete the file after import
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Export data from MongoDB to JSON file
const exportAllCollections = async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    if (!collections.length) {
      return res.status(404).send('No records found');
    }
    let records = {}
    for (const collection of collections) {
      const collectionName = collection.name;
      const data = await mongoose.connection.db.collection(collectionName).find({}).toArray()
      // console.log('----------', data)
      records[collectionName] = data;
    }
    const fileName = `export_${getCurrentDateTime()}.json`;

    fs.writeFile(fileName, JSON.stringify(records, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Failed to export data');
      }
      res.download(fileName, (err) => {
        if (err) {
          return res.status(500).send('File download failed');
        }
        fs.unlinkSync(fileName);
      });


    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }

};

const autoDetectObjectIds = (obj) => {
  for (let key in obj) {
    if (obj[key] && typeof obj[key] === 'object') {
      autoDetectObjectIds(obj[key]);
    } else if (mongoose.isValidObjectId(obj[key])) {
      //obj[key] = new mongoose.Types.ObjectId(obj[key]);
      //mongoose.Types.ObjectId.createFromHexString
      // console.log('---------', key)
      if (key != '__v' && key != 'userId') obj[key] = mongoose.Types.ObjectId.createFromHexString(obj[key]);
    }
  }
  return obj;
};
// Multer file upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, getCurrentDateTime() + path.extname(file.originalname));
  }
})
const upload = multer({ storage })

export {
  exportAllCollections,
  importAllCollections,
  upload
}

//exports.upload = upload.single('file');