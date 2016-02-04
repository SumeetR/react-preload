import React, { PropTypes, Component } from 'react';
import ContentHelper from './ContentHelper';

const propTypes = {
    // Rendered on success
    children: PropTypes.node.isRequired,

    // Rendered during load
    loadingIndicator: PropTypes.node.isRequired,

    // Array of content urls to be preloaded
    content: PropTypes.array,

    // If set, the preloader will automatically show
    // the children content after this amount of time
    autoResolveDelay: PropTypes.number,

    // Error callback. Is passed the error
    onError: PropTypes.func,

    // Success callback
    onSuccess: PropTypes.func,

    // Whether or not we should still show the content
    // even if there is a preloading error
    resolveOnError: PropTypes.bool,

    // Whether or not we should mount the child content after
    // content have finished loading (or after autoResolveDelay)
    mountChildren: PropTypes.bool,
};

const defaultProps = {
    content: [],
    resolveOnError: true,
    mountChildren: true,
};

class Preload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ready: false,
        };

        this._handleSuccess = this._handleSuccess.bind(this);
        this._handleError = this._handleError.bind(this);
    }

    componentWillMount() {
        if (!this.props.content || this.props.content.length === 0) {
            this._handleSuccess();
        }
    }

    componentDidMount() {
        if (!this.state.ready) {
            ContentHelper
                .loadContent(this.props.content)
                .then(this._handleSuccess, this._handleError);

            if (this.props.autoResolveDelay && this.props.autoResolveDelay > 0) {
                this.autoResolveTimeout = setTimeout(this._handleSuccess, this.props.autoResolveDelay);
            }
        }
    }

    componentWillUnmount() {
        if (this.autoResolveTimeout) {
            clearTimeout(this.autoResolveTimeout);
        }
    }

    _handleSuccess() {
        if (this.autoResolveTimeout) {
            clearTimeout(this.autoResolveTimeout);
            console.warn('content failed to preload, auto resolving');
        }

        if (this.state.ready) {
            return;
        }

        this.setState({
            ready: true,
        });

        if (this.props.onSuccess) {
            this.props.onSuccess();
        }
    }

    _handleError(err) {
        if (this.props.resolveOnError) {
            this._handleSuccess();
        }

        if (this.props.onError) {
            this.props.onError(err);
        }
    }

    render() {
        return (this.state.ready && this.props.mountChildren ? this.props.children : this.props.loadingIndicator);
    }
}

Preload.propTypes = propTypes;
Preload.defaultProps = defaultProps;

export default Preload;
