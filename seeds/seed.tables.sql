BEGIN;

  -- TRUNCATE
  -- "word",
  -- "language",
  -- "user";

  INSERT INTO "user"
    ("id", "username", "name", "password")
  VALUES
    (
      1,
      'dunder',
      'dunder',
      '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );
  --password=pass

  INSERT INTO "language"
    ("id", "name", "user_id")
  VALUES
    (1, 'French', 1);

  INSERT INTO "word"
    ("id", "language_id", "original", "translation", "next")
  VALUES
    (1, 1, 'entraine toi', 'practice', 2),
    (2, 1, 'bonjour', 'hello', 3),
    (3, 1, 'maison', 'house', 4),
    (4, 1, 'développeur', 'developer', 5),
    (5, 1, 'traduire', 'translate', 6),
    (6, 1, 'incroyable', 'amazing', 7),
    (7, 1, 'chien', 'dog', 8),
    (8, 1, 'chat', 'cat', 9),
    (9, 1, 'bureau', 'desk', 10),
    (10, 1, 'chaise', 'chair', 11),
    (11, 1, 'livre', 'book', 12),
    (12, 1, 'porte', 'door', 13),
    (13, 1, 'lit', 'bed', 14),
    (14, 1, 'dans', 'in', 15),
    (15, 1, 'sur', 'on', 16),
    (16, 1, 'sans', 'without', 17),
    (17, 1, 'visage', 'face', 18),
    (18, 1, 'yeux', 'eyes', 19),
    (19, 1, 'demain', 'tomorrow', 20),
    (20, 1, 'hier', 'yesterday', 21),
    (21, 1, 'heure', 'hour', 22),
    (22, 1, 'seconde', 'second', null);

  UPDATE "language" SET head = 1 WHERE id = 1;

  -- because we explicitly set the id fields
  -- update the sequencer for future automatic id setting
  SELECT setval('word_id_seq', (SELECT MAX(id)
    from "word"));
  SELECT setval('language_id_seq', (SELECT MAX(id)
    from "language"));
  SELECT setval('user_id_seq', (SELECT MAX(id)
    from "user"));

  COMMIT;
