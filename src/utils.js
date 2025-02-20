const getAccessToken = () => {
  try {
    const storage = sessionStorage.getItem(
      "oidc.user:https://auth.42.fr/auth/realms/students-42:frontend-react"
    );
    return storage ? JSON.parse(storage).access_token : null;
  } catch {
    return null;
  }
};

const getUserId = async (accessToken, login) => {
  const response = await fetch(
    `https://intrapy.intra.42.fr/api/v1/users/${login}/summary`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();

  return data.id.toString();
};

const getProfile = async (accessToken, userId) => {
  const response = await fetch(
    `https://pace-system.42.fr/api/v1/users/${userId}/profile`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();

  return data;
};
