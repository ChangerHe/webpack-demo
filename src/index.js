import React from 'react'
import ReactDOM from 'react-dom';

import APP_LOGO from '../public/1.png'
import reset from './index.css'
// import styles from './index.less'
import styles from './index.scss'
console.log(styles, 'styles')
class App extends React.Component {
  render() {
    return (
      <div className={styles.index}>
        <div className="test">112233</div>
        <img className={styles.test} src={APP_LOGO} />
        <div className="logo"></div>
        <div className="juejin-logo"></div>
        <div style={styles.logo}></div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));