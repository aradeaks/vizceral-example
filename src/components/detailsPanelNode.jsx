'use strict';

import React from 'react';

import ConnectionList from './connectionList';
import DetailsSubpanel from './detailsSubpanel';
import DetailsSubpanelSubNodes from './detailsSubpanelSubNodes';
import Notices from './notices';

import './detailsPanel.css';

class DetailsPanelNode extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      node: props.node,
      region: props.region,
      description: undefined
    };
  }

  componentWillReceiveProps (nextProps) {
    const newState = {
      region: nextProps.region,
      node: nextProps.node
    };

    if (this.state.region !== nextProps.region || this.state.node.getName() !== nextProps.node.getName()) {
      newState.description = undefined;
    }

    this.setState(newState);
  }

  render () {
    const { node } = this.state;
    const isZoomOut = node.graphRenderer === 'focused';
    const notices = (node && node.notices) || [];
    let zoomClassName = 'glyphicon clickable zoom-icon ';
    zoomClassName += isZoomOut ? 'glyphicon-log-out' : 'glyphicon-log-in';
    const zoomTitle = `Zoom ${isZoomOut ? 'out of' : 'into'} node view`;

    return (
      <div className="details-panel">
        <div className="subsection">
          <div className="details-panel-title">{node.getName()}
            <span title={zoomTitle} className={zoomClassName} onClick={this.props.zoomCallback}></span>
          </div>
          <div className="details-panel-close" onClick={this.props.closeCallback}>
            <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>
          </div>
        </div>
        <Notices notices={notices} />
        { node && !node.isEntryNode() && node.nodes
          ? <DetailsSubpanelSubNodes nodes={node.nodes} region={this.state.region} expanded={true} />
          : undefined }
        { node && !node.isEntryNode()
          ? <DetailsSubpanel title="Incoming Connections" badge={node.incomingConnections.length}>
            <ConnectionList key={node.getName()} connections={node.incomingConnections} direction="incoming" nodeClicked={clickedNode => this.props.nodeClicked(clickedNode)} />
          </DetailsSubpanel>
          : undefined }
        <DetailsSubpanel title="Outgoing Connections" badge={node.outgoingConnections.length}>
          <ConnectionList key={node.getName()} connections={node.outgoingConnections} direction="outgoing" nodeClicked={clickedNode => this.props.nodeClicked(clickedNode)} />
        </DetailsSubpanel>
      </div>
    );
  }
}

DetailsPanelNode.propTypes = {
  closeCallback: React.PropTypes.func.isRequired,
  zoomCallback: React.PropTypes.func.isRequired,
  node: React.PropTypes.object.isRequired,
  nodeClicked: React.PropTypes.func,
  region: React.PropTypes.string
};

DetailsPanelNode.defaultProps = {
  nodeClicked: () => {},
  region: ''
};

export default DetailsPanelNode;
