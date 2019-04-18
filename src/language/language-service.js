const LinkedList = require('./LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },
  getListWordCount(db, language_id) {
    return db
      .from("word")
      .select("*")
      .where("word.id", language_id);
  },
  populateList(db, languageId) {

    const wordList = new LinkedList();

    return db
      .select('*')
      .from('word')
      .where('language_id', languageId)
      .orderBy('id', 'desc')
      .then((rows) => {

        rows.forEach((row) => {
          wordList.insertFirst(row);
        });

        return wordList;
      })
      .then((ll) => {

        return db
          .select('total_score')
          .from('language')
          .where('id', languageId)
          .then((rows) => {

            ll.totalScore = rows[0]['total_score'];

            return ll;
          })
      });
  },
  async persistList(db, languageId, wordList) {

    let current = wordList.head;

    while (current !== null) {

      await db('word')
        .update({
          original        : current.val.original,
          translation     : current.val.translation,
          memory_value    : current.val.memory_value,
          correct_count   : current.val.correct_count,
          incorrect_count : current.val.incorrect_count,
          language_id     : current.val.language_id,
          next            : current.val.next,
        })
        .where('id', current.val.id)
        .andWhere('language_id', languageId)
        .then(() => {

          return db('language')
            .update('total_score', wordList.totalScore)
            .where('id', languageId)
            .then(() => {});
        });

      current = current.next;
    }
  },
};

module.exports = LanguageService;
