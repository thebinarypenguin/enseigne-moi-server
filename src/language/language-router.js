const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words
    });
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      nextWord: words[0].original,
      totalScore: req.language.total_score,
      wordCorrectCount: words[0].correct_count,
      wordIncorrectCount: words[0].incorrect_count
    });
  } catch (err) {
    next(err);
  }
});

languageRouter.post("/guess", express.json(), async (req, res, next) => {

  const db     = req.app.get('db');
  const langId = req.language.id;

  if (!req.body['learn-guess-input']) {
    res.status(400).json({ error: "Missing 'guess' in request body"})
  }

  guess = req.body['learn-guess-input'];
  // errror check herer

  // populate list with word list from DB
  const list = await LanguageService.populateList(db, langId)

  console.log(JSON.stringify(list, null, 2));

  const currentWordNode = list.head;

  if (guess.toLowerCase() === currentWordNode.val.translation) {

    // update memory value
    currentWordNode.val.memory_value *= 2;

    // update correct count
    currentWordNode.val.correct_count += 1;

    // update
    list.totalScore += 1;

  } else {

    // update memory value
    list.head.val.memory_value = 1;

    // update incorrect count
    list.head.val.incorrect_count += 1;

    // don't touch total score
  }

  // Shift currentWordNode down by it's memory_value
  for (let i = 0; i < currentWordNode.memory_value; i++) {
    list.moveDown(currentWordNode);
  }

list.totalScore = 100;

  // persist to DB
  await LanguageService.persistList(db, langId, list);

  res.json({
    foo: 'bar',
  });

  // -------




  // // current word being asked/answered
  // const node = LinkedList.head

  // const answer = node.val.translation;

  // let isCorrect;

  // // TODO tolowercase
  // if (guess === answer) {
  //   isCorrect = true;

  //   //update meme val for current word
  //   list.head.val.memory_value =  list.head.val.memory_value * 2;
  //   // correct count +1

  //   // decorate ll instance with a totalScore property, this will be saved via persist function
  //   // update total score in the DB
  // } else {
  //   isCorrect = false;
  //   list.head.val.memory_value = 1;
  //   list.head.val.incorrect_count += 1;
  // }

  // shift ll.head "down" by list.head.val.memory_value spaces


  // persist list to DB
  // LanguageService.setWordList(ll)

  // res.json({
  //   // stuff here
  // })




  // Check if the submitted answer is correct by comparing it with the translation in the database.
    // you mean the LL right?  and we compare to LL.head.val ???
    // if correct, +1 correct_count, *2 memory_value
    // if incorrect, +1 incorrect_count, memory_value = 1
    // update total score in language table


  // Shift the word along the linked list the appropriate amount of spaces.
    // Why? in order to update what HEAD is ???


  // Persist the updated words and language in the database.

  // return response

  // ----------- Notes From Alex






  // try {
  //   const word = await LanguageService.getLanguageWords(
  //     req.app.get("db"),
  //     req.language.id
  //   );
  //   if (word[0].translation !== guess.toLowerCase()) {
  //     res.json({
  //       nextWord: word[1].original,
  //       totalScore: req.language.total_score,
  //       wordCorrectCount: words[0].correct_count,
  //       wordIncorrectCount: words[0].incorrect_count,
  //       answer: words[0].translation,
  //       isCorrect: false
  //     });
  //     if (word[0].translation === guess.toLowerCase()) {
  //       //TODO: update Database score, incorrect/correct and M value inside language-service
  //       res.json({
  //         nextWord: word[1],
  //         original,
  //         totalScore: req.language.total_score,
  //         wordCorrectCount: words[0].correct_count,
  //         wordIncorrectCount: words[0].incorrect_count,
  //         answer: words[0].translation,
  //         isCorrect: true
  //       });
  //     }
  //   }
  //   // res.json({ guessedWord: words[0].original,
  //   // translation: words[0].translation, })
  //   next();
  // } catch (err) {
  //   next(err);
  // }
  // res.send("implement me!");
});

// TODO DELETE ME
// languageRouter.get('/test', async (req, res, next) => {

//   const db = req.app.get('db');

//   const ll = await LanguageService.getWordList(db, 1);

//   await LanguageService.setWordList(db, 1, ll);

//   console.log('done');

//   res.end('foobar');
// })

module.exports = languageRouter;
