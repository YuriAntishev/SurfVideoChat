const users: any = [];

export const addUser = ({ id, name, room }: any) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  const existingUser = users.find(
    (user: any) => user.room === room && user.name === name
  );
  if (!name || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, name, room };
  users.push(user);

  return { user };
};

export const removeUser = (id: any) => {
  const index = users.findIndex((user: any) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUsersInRoom = (room: any) =>
  users.filter((user: any) => user.room === room);
