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

  const { guess } = req.body;

  if (!guess) {
    return res.status(400).json({ error: "Missing 'guess' in request body"})
  }

  // populate list with words from DB
  const list = await LanguageService.populateList(db, langId)

  const currentWordNode = list.head;

  let isCorrect;

  if (guess.toLowerCase() === currentWordNode.val.translation.toLowerCase()) {

    isCorrect = true;

    // update memory value
    currentWordNode.val.memory_value *= 2;

    // update correct count
    currentWordNode.val.correct_count += 1;

    // update
    list.totalScore += 1;

  } else {

    isCorrect = false;

    // update memory value
    currentWordNode.val.memory_value = 1;

    // update incorrect count
    currentWordNode.val.incorrect_count += 1;

    // don't touch total score
  }

  // Shift currentWordNode down by it's memory_value
  for (let i = 0; i < currentWordNode.val.memory_value; i++) {
    list.moveDown(currentWordNode);
  }

  // persist to DB
  await LanguageService.persistList(db, langId, list);

  res.json({

    // next word info
    nextWord           : list.head.val.original,
    wordCorrectCount   : list.head.val.correct_count,
    wordIncorrectCount : list.head.val.incorrect_count,

    // global
    totalScore         : list.totalScore,

    // current word info
    answer             : currentWordNode.val.translation,
    isCorrect          : isCorrect,
  });

});

module.exports = languageRouter;
