// validations/commentaire.js
const { check } = require('express-validator');

exports.createCommentaireRules = [
  check('actualite')
    .notEmpty().withMessage('Le champ actualite est requis')
    .isMongoId().withMessage('L’ID d’actualité doit être valide'),

  check('contenu')
    .isLength({ min: 1 }).withMessage('Le contenu ne peut pas être vide')
    .isString().withMessage('Le contenu doit être une chaîne de caractères')
];
