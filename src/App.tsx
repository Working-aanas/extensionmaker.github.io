import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <header>
        <h1>Welcome to My Futuristic Portfolio</h1>
      </header>
      <main>
        <p>This is a showcase of my work and projects.</p>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} My Portfolio. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;