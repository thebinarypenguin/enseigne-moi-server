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

languageRouter.post("/guess", async (req, res, next) => {
  let { guess } = req.body;
  try {
    const word = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );
    if (res.json(word[0].translation !== guess.toLowerCase())) {
      res.json({
        nextWord: word[1].original,
        totalScore: req.language.total_score,
        wordCorrectCount: words[0].correct_count,
        wordIncorrectCount: words[0].incorrect_count,
        answer: words[0].translation,
        isCorrect: false
      });
      if (res.json(word[0].translation === guess.toLowerCase())) {
        //TODO: update Database score, incorrect/correct and M value inside language-service
        res.json({
          nextWord: word[1],
          original,
          totalScore: req.language.total_score,
          wordCorrectCount: words[0].correct_count,
          wordIncorrectCount: words[0].incorrect_count,
          answer: words[0].translation,
          isCorrect: true
        });
      }
    }
    // res.json({ guessedWord: words[0].original,
    // translation: words[0].translation, })
    next();
  } catch (err) {
    next(err);
  }
  res.send("implement me!");
});

module.exports = languageRouter;
