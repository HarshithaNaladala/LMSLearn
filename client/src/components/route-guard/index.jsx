import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useLocation, Navigate } from 'react-router-dom';



function RouteGuard ( {authenticated, user, element} ) {

    const location = useLocation();

    if(!authenticated && !location.pathname.includes('/auth') ){
        return <Navigate to={'/auth'} />
    }

    if(authenticated && user?.role!=='instructor' && (location.pathname.includes('instructor') || location.pathname.includes('/auth'))){
        return <Navigate to={'/home'} />
    }

    if(authenticated && user.role==='instructor' && !location.pathname.includes('instructor')){
        return <Navigate to={'/instructor'} />
    }

    return <Fragment>{element}</Fragment>
}

RouteGuard.propTypes = {
    authenticated: PropTypes.bool.isRequired,    // authenticated must be a boolean
    user: PropTypes.shape({                      // user must be an object with a 'role' property
        role: PropTypes.string
    }),
    element: PropTypes.element.isRequired       // element must be a valid React component or element
};

export default RouteGuard;