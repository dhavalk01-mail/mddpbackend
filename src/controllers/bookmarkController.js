import Bookmark from "../models/bookmarkModel.js";
import zod from "zod";

const schema = zod.object({
  userId: zod.string(), 
  bookmarkId: zod.string(),
});

const addBookmark = async (req, res) => {
  console.log(req.body)
  const newBook = schema.safeParse(req.body);

  if (!newBook.success) {
    return res.status(404).json({
      err: "incorrect inputs",
      msg: newBook.error.issues
    });
  }

  const newnewBookmark = await Bookmark.create({
    userId: req.body.userId,
    bookmarkId: req.body.bookmarkId,
  });

  const bookmarkId = newnewBookmark._id;
  return res.json({ msg: `Bookmark created with id = ${bookmarkId} ` });
};

const getBookmark = async (req, res) => {
  try {
    // Get Subscription by ID
    if (req.params.id) {
      const reqBookmark = await Bookmark.find( {bookmarkId: req.params.id});
      if (!reqBookmark) {
        return res.status(404).json({ message: 'Bookmark not found' });
      }
      res.json(reqBookmark);
    } else {

      // Get all Subscriptions
      const bookmark = await Bookmark.aggregate([
        { $lookup:
           {
             from: 'bookmark',
             localField: '_id',
             foreignField: 'bookmarkId',
             as: 'serviceDetails'
           }
         }
        ])
        
      res.json({
        bookmark
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
    addBookmark,
    getBookmark
};
