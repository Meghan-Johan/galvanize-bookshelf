
exports.seed = function(knex) {
  return knex('favorites')
  .del()
  .then(() =>
  knex('favorites').insert([{
    id: 1,
    book_id: 1,
    user_id: 1,
    created_at: new Date('2016-06-29 14:26:16 UTC'),
    updated_at: new Date('2016-06-29 14:26:16 UTC')
  }])
)
.then(() =>
knex.raw("SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites))"))
};
