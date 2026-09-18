let MOCK_USERS = [
  { id: 1, full_name: 'Nguyen Van An', email: 'an@gmail.com', role: 'admin', is_active: true, password_hash: '$2b$10$abc...' },
  { id: 2, full_name: 'Tran Thi Binh', email: 'binh@gmail.com', role: 'user', is_active: true, password_hash: '$2b$10$def...' },
  { id: 3, full_name: 'Le Van Cuong', email: 'cuong@gmail.com', role: 'user', is_active: false, password_hash: '$2b$10$ghi...' },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getAllUsersFromDB = async () => {
  await delay(200);
  return [...MOCK_USERS];
};

export const getUserByIdFromDB = async (id) => {
  await delay(100);
  return MOCK_USERS.find((u) => u.id === id) ?? null;
};

export const getUserByEmailFromDB = async (email) => {
  await delay(100);
  return MOCK_USERS.find((u) => u.email === email) ?? null;
};

export const createUserInDB = async ({ fullName, email, role = 'user', password_hash }) => {
  await delay(200);
  const newUser = {
    id: MOCK_USERS.length > 0 ? Math.max(...MOCK_USERS.map((u) => u.id)) + 1 : 1,
    full_name: fullName,
    email,
    role,
    is_active: true,
    password_hash,
    refresh_token: null,
    created_at: new Date().toISOString(),
  };
  MOCK_USERS.push(newUser);
  return { ...newUser };
};

export const updateRefreshToken = async (userId, refreshToken) => {
  await delay(100);
  const user = MOCK_USERS.find((u) => u.id === Number(userId));
  if (user) {
    user.refresh_token = refreshToken;
  }
};

export const findByRefreshToken = async (refreshToken) => {
  await delay(100);
  return MOCK_USERS.find((u) => u.refresh_token === refreshToken) ?? null;
};
