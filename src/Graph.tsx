// Import necessary modules and styles. The inclusion of TableData suggests we need it for type checking or for using the Perspective table functionalities.
import React, { Component } from 'react';
import { Table, TableData } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import { DataManipulator } from './DataManipulator';
import './Graph.css';

// Define interfaces for props and for the custom PerspectiveViewerElement.
interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

// Define the Graph component which will render and manage the PerspectiveViewer for visualizing the data.
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  // Render method returns a PerspectiveViewer element, which will be manipulated in other lifecycle methods.
  render() {
    return React.createElement('perspective-viewer');
  }

  // When the component mounts, we initialize the PerspectiveViewer and set up the table schema.
  componentDidMount() {
    // Acquire a reference to the PerspectiveViewer element in the DOM.
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    // Define the schema for the data that will be visualized, reflecting the new data structure focusing on price ratios and alerts.
    const schema = {
      price_abc:'float',
      price_def:'float',
      ratio: 'float',
      timestamp: 'date',
      upper_bound: 'float',
      lower_bound: 'float',
      trigger_alert: 'float',
    };

    // Initialize the Perspective table if possible.
    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    // If the table is initialized, configure the PerspectiveViewer with the appropriate attributes for the visualization.
    if (this.table) {
      elem.load(this.table); // Load the table into the PerspectiveViewer.
      elem.setAttribute('view', 'y_line'); // Set the view type to a line chart, focusing on time series data.
      elem.setAttribute('row-pivots', '["timestamp"]'); // Pivot the data by timestamp to track changes over time.
      elem.setAttribute('columns', '["ratio", "lower_bound", "upper_bound", "trigger_alert"]'); // Specify the columns to be visualized, focusing on the ratio and its bounds.
      // Define how the data should be aggregated in the visualization.
      elem.setAttribute('aggregates', JSON.stringify({
        price_abc: 'avg',
        price_def: 'avg',
        ratio: 'avg',
        timestamp: 'distinct count',
        upper_bound: 'avg',
        lower_bound: 'avg',
        trigger_alert: 'avg',
      }));
    }
  }

  // When the component updates, update the Perspective table with new data.
  componentDidUpdate() {
    // Check if the table exists and if there is new data, then update the table accordingly.
    if (this.table) {
      this.table.update([
        DataManipulator.generateRow(this.props.data),
      ] as unknown as TableData);
    }
  }
}

// Make the Graph component available for import into other modules.
export default Graph;
