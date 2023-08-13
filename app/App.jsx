import React, { useEffect, useState } from 'react';

const ALLOWED_MESSAGES = ['AUTH_TOKEN', 'AUTH_USER', 'AUTH_SHOW'];

const styles = {
  iframe: {
    position: 'fixed',
    background: 'white',
    width: '400px',
    height: '200px',
    display: 'none',
  },
  shown: {
    display: 'block',
  },
  button: {
    marginTop: '200px',
  },
};

const App = () => {
  const [isAuthShown, setIsAuthShown] = useState(false);
  const [user, setUser] = useState(null);
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      if (!ALLOWED_MESSAGES.includes(event?.data?.type)) return;

      switch (event?.data?.type) {
        case 'AUTH_TOKEN': {
          const { authToken, user = {} } = event?.data || {};
          const { iat, exp } = user;

          console.log('AUTH_TOKEN', { authToken, user });
          localStorage.setItem('authToken', authToken);

          setUser(user);
          setIsAuthShown(false);

          setTimeout(() => {
            setUser(null);
            setIsAuthShown(true);
          }, exp * 1000 - Date.now());
          break;
        }
        case 'AUTH_SHOW': {
          console.log('AUTH_SHOW');
          localStorage.removeItem('authToken');
          setIsAuthShown(true);
          break;
        }
      }
    });
  }, []);

  return (
    <>
      <iframe
        src="http://localhost:3000"
        style={{
          ...styles.iframe,
          ...(isAuthShown && styles.shown),
        }}
      />

      {user ? (
        <h1>
          Hello {user.username} with pass {user.password}
        </h1>
      ) : (
        <h1>Hello, please log in</h1>
      )}

      <button
        onClick={async () => {
          const { authToken } = localStorage;

          const response = await fetch('http://localhost:3002/data', {
            headers: {
              authToken,
            },
          });

          const { data: newData } = await response.json();
          setApiData((apiData) => [...apiData, newData]);
        }}
        style={styles.button}
      >
        Click Me
      </button>

      {apiData.map((item, i) => (
        <code key={i}>
          <pre>{JSON.stringify(item, null, 2)}</pre>
        </code>
      ))}
    </>
  );
};

export default App;
