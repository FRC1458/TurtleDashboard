import React, {PropTypes} from "react";
import socket from "./util/socket.js";

class App extends React.Component {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }

    componentWillMount() {
        
    }
}

App.propTypes = {
    children: PropTypes.object.isRequired
};

export default App;
