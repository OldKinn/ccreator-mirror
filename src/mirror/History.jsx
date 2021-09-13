// eslint-disable-next-line
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { actions } from './actions';

class History extends React.Component {
    componentDidUpdate() {
        const { routePush, routeReplace } = this.props;
        if (routePush || routeReplace) {
            actions.route.set({
                routePush: '',
                routeReplace: '',
            });
        }
    }

    render() {
        const { routePush, routeReplace } = this.props;
        return (
            <React.Fragment>
                {routePush && <Redirect push to={routePush} />}
                {routeReplace && <Redirect to={routeReplace} />}
            </React.Fragment>
        );
    }
}

function dispatch({ route }) {
    return {
        routePush: route.routePush,
        routeReplace: route.routeReplace,
    };
}

export default connect(dispatch)(History);
