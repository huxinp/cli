import React from 'react';
import { createRoot } from 'react-dom/client';
import styles from './app.css';

createRoot(document.getElementById('root'))
  .render(<div className={`${styles.main} main3`}>React</div>)
