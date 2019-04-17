const List = require("./list");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },
  getListWordCount(db, language_id) {
    return db
      .from("word")
      .select("*")
      .where("word.id", language_id);
  },
  populateList(db, language_id) {
    let ll = "";
    for (let i = 0; i < this.getWordListCount(db, language_id); i++) {
      insertLast({});
    }
  }
  // persistList(),
};

module.exports = LanguageService;
