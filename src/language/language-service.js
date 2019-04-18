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
      .select('total_score', 'head')
      .from('language')
      .where('id', languageId)
      .then((rows) => {

        wordList.totalScore = rows[0]['total_score'];

        return rows[0].head;
      })
      .then((head) => {

        return db
          .select('*')
          .from('word')
          .where('language_id', languageId)
          .then((rows) => {

            const insert = function (wordId) {

              if (wordId === null || wordId === undefined) {
                return;
              }

              // find word row in resultset
              const row = rows.find((w) => { return w.id === wordId });

              wordList.insertLast(row)

              insert(row.next);
            }

            insert(head);

            return wordList;
          });
      });
  },
  async persistList(db, languageId, wordList) {

    let head = null;

    if (wordList.head.val) {
      head = wordList.head.val.id;
    }

    let current = wordList.head;

    while (current !== null) {

      let nextWordId = null;

      if (current.next) {
        nextWordId = current.next.val.id;
      }

      await db('word')
        .update({
          original        : current.val.original,
          translation     : current.val.translation,
          memory_value    : current.val.memory_value,
          correct_count   : current.val.correct_count,
          incorrect_count : current.val.incorrect_count,
          language_id     : current.val.language_id,
          next            : nextWordId,
        })
        .where('id', current.val.id)
        .andWhere('language_id', languageId)
        .returning(['id', 'next'])
        .then((resp) => {

          return db('language')
            .update({
              'total_score': wordList.totalScore,
              'head': head,
            })
            .where('id', languageId)
            .then(() => {});
        });

      current = current.next;
    }
  },
};

module.exports = LanguageService;
