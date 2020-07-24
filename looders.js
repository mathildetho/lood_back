const users = [];

const addUser = ({ id, pseudo, room }) => {
  pseudo = pseudo.toLowerCase();
  room = room.toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.pseudo === pseudo);

  const user = { id, pseudo, room };

  users.push(user);

  return { user };
}

const getUser = (id) => users.find((user) => user.id === id);

module.exports = { addUser, getUser };