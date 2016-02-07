import React, { PropTypes, Component } from 'react';
import ContentHelper from './ContentHelper';

const propTypes = {
    // Rendered on success
    children: PropTypes.node.isRequired,

    // Rendered during load
    loadingIndicator: PropTypes.node.isRequired,

    // Array of content urls to be preloaded
    content: PropTypes.array,

    // Shows percentage loaded
    showPercentage: PropTypes.bool,

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
            loaded: 0
        };

        this._handleSuccess = this._handleSuccess.bind(this);
        this._handleError = this._handleError.bind(this);
        this._handleItemSuccess = this._handleItemSuccess.bind(this);
    }

    componentWillMount() {
        if (!this.props.content || this.props.content.length === 0) {
            this._handleSuccess();
        }
    }

    componentDidMount() {
        if (!this.state.ready) {
            ContentHelper
                .loadContent(this.props.content, this._handleItemSuccess.bind(this))
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

    _handleItemSuccess(success) {
        if (success) {
            this.setState({
                loaded: this.state.loaded + 1
            });
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
            ready: true
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
        return (
            <span>
                {this.props.showPercentage ? <span>{Math.round((this.state.loaded*100)/this.props.content.length)}%&nbsp;</span> : null}
                {this.state.ready && this.props.mountChildren ? this.props.children : this.props.loadingIndicator}
            </span>
        );
    }
}

Preload.propTypes = propTypes;
Preload.defaultProps = defaultProps;

export default Preload;
