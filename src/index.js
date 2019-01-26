import React from 'react'
import ReactDOM from 'react-dom';
import APP_LOGO from '../public/1.png'

class App extends React.Component {
  render() {
    return <div>
      <div>112233</div>
      <img src={APP_LOGO} />
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('root'));